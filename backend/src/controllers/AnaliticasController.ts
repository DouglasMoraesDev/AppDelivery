import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export class AnaliticasController {
  async getDashboard(req: Request, res: Response) {
    const tenantId = req.user!.tenantId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      todayOrders,
      todayRevenue,
      totalCustomers,
      pendingOrders,
    ] = await Promise.all([
      prisma.order.count({
        where: {
          tenantId,
          createdAt: { gte: today },
        },
      }),
      prisma.order.aggregate({
        where: {
          tenantId,
          createdAt: { gte: today },
          status: { not: 'CANCELLED' },
        },
        _sum: { total: true },
      }),
      prisma.customer.count({
        where: { tenantId },
      }),
      prisma.order.count({
        where: {
          tenantId,
          status: { in: ['PENDING', 'CONFIRMED', 'PREPARING'] },
        },
      }),
    ]);

    return res.json({
      todayOrders,
      todayRevenue: Number(todayRevenue._sum.total || 0),
      totalCustomers,
      pendingOrders,
    });
  }

  async getByPeriod(req: Request, res: Response) {
    const tenantId = req.user!.tenantId;
    const { startDate, endDate } = req.query;

    const orders = await prisma.order.findMany({
      where: {
        tenantId,
        createdAt: {
          gte: new Date(String(startDate)),
          lte: new Date(String(endDate)),
        },
        status: { not: 'CANCELLED' },
      },
      select: {
        total: true,
        createdAt: true,
      },
    });

    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    return res.json({
      totalOrders: orders.length,
      totalRevenue,
      avgOrderValue,
    });
  }

  async getTopProducts(req: Request, res: Response) {
    const tenantId = req.user!.tenantId;

    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          tenantId,
          status: { not: 'CANCELLED' },
        },
      },
      _sum: {
        quantity: true,
        subtotal: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 10,
    });

    const productsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { id: true, name: true, price: true, image: true },
        });

        return {
          ...product,
          quantitySold: item._sum.quantity,
          revenue: Number(item._sum.subtotal),
        };
      })
    );

    return res.json(productsWithDetails);
  }

  async getDetailedReport(req: Request, res: Response) {
    const tenantId = req.user!.tenantId;
    const { period, startDate, endDate } = req.query;

    let dateFilter: any = {};
    const now = new Date();

    if (period === 'daily') {
      dateFilter = {
        gte: new Date(now.setHours(0, 0, 0, 0)),
      };
    } else if (period === 'weekly') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      dateFilter = { gte: weekAgo };
    } else if (period === 'monthly') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      dateFilter = { gte: monthAgo };
    } else if (startDate && endDate) {
      dateFilter = {
        gte: new Date(String(startDate)),
        lte: new Date(String(endDate)),
      };
    }

    // Pedidos do período
    const orders = await prisma.order.findMany({
      where: {
        tenantId,
        createdAt: dateFilter,
        status: { not: 'CANCELLED' },
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

    // Produtos mais pedidos
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          tenantId,
          createdAt: dateFilter,
          status: { not: 'CANCELLED' },
        },
      },
      _sum: {
        quantity: true,
        subtotal: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 10,
    });

    const topProductsDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });
        return {
          id: product?.id,
          name: product?.name,
          quantity: item._sum.quantity,
          revenue: Number(item._sum.subtotal || 0),
        };
      })
    );

    // Clientes que mais pediram
    const topCustomers = await prisma.order.groupBy({
      by: ['customerId'],
      where: {
        tenantId,
        createdAt: dateFilter,
        status: { not: 'CANCELLED' },
      },
      _count: {
        id: true,
      },
      _sum: {
        total: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 10,
    });

    const topCustomersDetails = await Promise.all(
      topCustomers.map(async (item) => {
        const customer = await prisma.customer.findUnique({
          where: { id: item.customerId },
        });
        return {
          id: customer?.id,
          name: customer?.name,
          phone: customer?.phone,
          orderCount: item._count.id,
          totalSpent: Number(item._sum.total || 0),
        };
      })
    );

    // Pedidos por localização (bairro)
    const ordersByLocation = orders.reduce((acc: any, order) => {
      const deliveryAddress = order.deliveryAddress as any;
      const location = deliveryAddress?.district || 'Não informado';
      if (!acc[location]) {
        acc[location] = {
          location,
          count: 0,
          revenue: 0,
        };
      }
      acc[location].count += 1;
      acc[location].revenue += Number(order.total);
      return acc;
    }, {});

    const locationStats = Object.values(ordersByLocation).sort(
      (a: any, b: any) => b.count - a.count
    );

    // Estatísticas gerais
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    return res.json({
      period: period || 'custom',
      totalOrders: orders.length,
      totalRevenue,
      avgOrderValue,
      topProducts: topProductsDetails,
      topCustomers: topCustomersDetails,
      ordersByLocation: locationStats,
      recentOrders: orders.slice(0, 20).map((order) => ({
        id: order.id,
        customerName: order.customer.name,
        total: Number(order.total),
        status: order.status,
        createdAt: order.createdAt,
        items: order.items.length,
      })),
    });
  }
}
