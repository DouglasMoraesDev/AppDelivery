import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import { ErroApp } from '../middlewares/tratadorErros';

const createPublicOrderSchema = z.object({
  customerName: z.string().min(1, 'Nome é obrigatório'),
  phone: z.string().min(10, 'Telefone inválido'),
  email: z.string().email().optional(),
  type: z.enum(['DELIVERY', 'PICKUP']),
  deliveryAddress: z.object({
    street: z.string(),
    number: z.string(),
    district: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string().optional(),
    complement: z.string().optional(),
    referencePoint: z.string().optional(),
  }).optional(),
  paymentMethod: z.enum(['PIX', 'CREDIT_CARD', 'DEBIT_CARD', 'CASH']),
  notes: z.string().optional(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().positive(),
    notes: z.string().optional(),
  })).min(1, 'Adicione pelo menos um item'),
  tenantSlug: z.string(), // slug do restaurante
});

export class PedidoPublicoController {
  // Criar pedido público (sem autenticação)
  async createPublic(req: Request, res: Response) {
    try {
      const data = createPublicOrderSchema.parse(req.body);
      
      console.log('📦 Criando pedido público:', data.customerName);

      // Buscar tenant pelo slug
      const tenant = await prisma.tenant.findUnique({
        where: { slug: data.tenantSlug },
        include: { plan: true },
      });

      if (!tenant) {
        throw new ErroApp('Restaurante não encontrado', 404);
      }

      if (tenant.status === 'SUSPENDED' || tenant.status === 'CANCELLED') {
        throw new ErroApp('Este restaurante não está aceitando pedidos no momento', 403);
      }

      // Validar produtos
      const products = await prisma.product.findMany({
        where: {
          id: { in: data.items.map(item => item.productId) },
          tenantId: tenant.id,
          available: true,
        },
      });

      if (products.length !== data.items.length) {
        throw new ErroApp('Alguns produtos não estão disponíveis', 400);
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
        // Criar novo cliente com endereço
        customer = await prisma.customer.create({
          data: {
            tenantId: tenant.id,
            name: data.customerName,
            phone: data.phone,
            email: data.email,
            addresses: data.deliveryAddress ? [data.deliveryAddress] : [],
            totalOrders: 0,
            totalSpent: 0,
          },
        });
      } else {
        // Atualizar endereço se for novo
        if (data.deliveryAddress) {
          const addresses = (customer.addresses as any[]) || [];
          const addressExists = addresses.some(addr => 
            addr.street === data.deliveryAddress?.street && 
            addr.number === data.deliveryAddress?.number
          );
          
          if (!addressExists) {
            await prisma.customer.update({
              where: { id: customer.id },
              data: {
                addresses: [...addresses, data.deliveryAddress],
              },
            });
          }
        }
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

      console.log('✅ Pedido criado:', orderNumber);

      return res.status(201).json(order);
    } catch (error) {
      console.error('❌ Erro ao criar pedido:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: 'Dados inválidos', 
          details: error.errors 
        });
      }
      throw error;
    }
  }

  // Listar pedidos do cliente por telefone
  async listByPhone(req: Request, res: Response) {
    const { phone } = req.params;
    const { tenantSlug } = req.query;

    if (!tenantSlug) {
      throw new ErroApp('tenantSlug é obrigatório', 400);
    }

    // Buscar tenant
    const tenant = await prisma.tenant.findUnique({
      where: { slug: String(tenantSlug) },
    });

    if (!tenant) {
      throw new ErroApp('Restaurante não encontrado', 404);
    }

    // Buscar cliente
    const customer = await prisma.customer.findFirst({
      where: {
        tenantId: tenant.id,
        phone: phone,
      },
    });

    if (!customer) {
      return res.json([]);
    }

    // Buscar pedidos
    const orders = await prisma.order.findMany({
      where: {
        tenantId: tenant.id,
        customerId: customer.id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        customer: {
          select: {
            name: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.json(orders);
  }

  // Buscar pedido por número
  async getByOrderNumber(req: Request, res: Response) {
    const { orderNumber } = req.params;
    const { tenantSlug, phone } = req.query;

    if (!tenantSlug || !phone) {
      throw new ErroApp('tenantSlug e phone são obrigatórios', 400);
    }

    // Buscar tenant
    const tenant = await prisma.tenant.findUnique({
      where: { slug: String(tenantSlug) },
    });

    if (!tenant) {
      throw new ErroApp('Restaurante não encontrado', 404);
    }

    // Buscar pedido
    const order = await prisma.order.findFirst({
      where: {
        tenantId: tenant.id,
        orderNumber: orderNumber.startsWith('#') ? orderNumber : `#${orderNumber}`,
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

    if (!order) {
      throw new ErroApp('Pedido não encontrado', 404);
    }

    // Validar se o telefone corresponde ao cliente do pedido
    if (order.customer.phone !== phone) {
      throw new ErroApp('Pedido não encontrado', 404);
    }

    return res.json(order);
  }
}
