import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import { ErroApp } from '../middlewares/tratadorErros';

const createOrderSchema = z.object({
  customerName: z.string(),
  phone: z.string(),
  email: z.string().email().optional(),
  type: z.enum(['DELIVERY', 'PICKUP']),
  deliveryAddress: z.object({
    street: z.string(),
    number: z.string(),
    district: z.string(),
    zipCode: z.string(),
    complement: z.string().optional(),
    referencePoint: z.string().optional(),
    coords: z.object({
      lat: z.number(),
      lng: z.number(),
    }).optional(),
  }).optional(),
  paymentMethod: z.enum(['PIX', 'CREDIT_CARD', 'DEBIT_CARD', 'CASH']),
  notes: z.string().optional(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().positive(),
    notes: z.string().optional(),
  })),
  couponCode: z.string().optional(),
});

export class PedidoController {
  async create(req: Request, res: Response) {
    const data = createOrderSchema.parse(req.body);
    const tenant = req.tenant;

    // Validar produtos
    const products = await prisma.product.findMany({
      where: {
        id: { in: data.items.map(item => item.productId) },
        tenantId: tenant.id,
        available: true,
      },
    });

    if (products.length !== data.items.length) {
      throw new ErroApp('Some products are not available', 400);
    }

    // Calcular total
    let total = 0;
    const orderItems = data.items.map(item => {
      const product = products.find(p => p.id === item.productId)!;
      const subtotal = Number(product.price) * item.quantity;
      total += subtotal;

      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        subtotal,
        notes: item.notes,
      };
    });

    // Buscar ou criar cliente
    let customer = await prisma.customer.findFirst({
      where: {
        tenantId: tenant.id,
        phone: data.phone,
      },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          tenantId: tenant.id,
          name: data.customerName,
          phone: data.phone,
          email: data.email,
          totalOrders: 0,
          totalSpent: 0,
        },
      });
    }

    // Gerar número do pedido
    const lastOrder = await prisma.order.findFirst({
      where: { tenantId: tenant.id },
      orderBy: { createdAt: 'desc' },
    });

    const orderNumber = lastOrder
      ? `#${String(parseInt(lastOrder.orderNumber.replace('#', '')) + 1).padStart(4, '0')}`
      : '#0001';

    // Criar pedido
    const order = await prisma.order.create({
      data: {
        tenantId: tenant.id,
        customerId: customer.id,
        orderNumber,
        type: data.type,
        deliveryAddress: data.deliveryAddress || undefined,
        paymentMethod: data.paymentMethod,
        notes: data.notes,
        total,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        customer: true,
      },
    });

    // Atualizar estatísticas do cliente
    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        totalOrders: { increment: 1 },
        totalSpent: { increment: total },
      },
    });

    return res.status(201).json(order);
  }

  async list(req: Request, res: Response) {
    const tenantId = req.user!.tenantId;
    const { status, startDate, endDate } = req.query;

    const orders = await prisma.order.findMany({
      where: {
        tenantId,
        ...(status && { status: String(status) as any }),
        ...(startDate && endDate && {
          createdAt: {
            gte: new Date(String(startDate)),
            lte: new Date(String(endDate)),
          },
        }),
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.json(orders);
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;

    const order = await prisma.order.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new ErroApp('Order not found', 404);
    }

    return res.json(order);
  }

  async updateStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = z.object({
      status: z.enum(['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED']),
    }).parse(req.body);
    const tenantId = req.user!.tenantId;

    const order = await prisma.order.findFirst({
      where: { id, tenantId },
    });

    if (!order) {
      throw new ErroApp('Order not found', 404);
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        status,
        ...(status === 'CONFIRMED' && { confirmedAt: new Date() }),
        ...(status === 'DELIVERED' && { deliveredAt: new Date() }),
        ...(status === 'CANCELLED' && { cancelledAt: new Date() }),
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return res.json(updated);
  }

  async cancel(req: Request, res: Response) {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;

    const order = await prisma.order.findFirst({
      where: { id, tenantId },
    });

    if (!order) {
      throw new ErroApp('Order not found', 404);
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
      },
    });

    return res.json(updated);
  }
}
