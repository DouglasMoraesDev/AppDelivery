import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export class ClienteController {
  async list(req: Request, res: Response) {
    const tenantId = req.user!.tenantId;

    const customers = await prisma.customer.findMany({
      where: { tenantId },
      include: {
        _count: {
          select: { orders: true },
        },
      },
      orderBy: {
        totalSpent: 'desc',
      },
    });

    return res.json(customers);
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;

    const customer = await prisma.customer.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
        _count: {
          select: { orders: true },
        },
      },
    });

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    return res.json(customer);
  }

  async getOrders(req: Request, res: Response) {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;

    const orders = await prisma.order.findMany({
      where: {
        customerId: id,
        tenantId,
      },
      include: {
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
}
