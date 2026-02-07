import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export class TenantController {
  async getPublicConfig(req: Request, res: Response) {
    const { slug } = req.params;

    const tenant = await prisma.tenant.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        businessName: true,
        phone: true,
        whatsappNumber: true,
        logo: true,
        primaryColor: true,
        secondaryColor: true,
        schedule: true,
        isOpen: true,
        city: true,
        state: true,
      },
    });

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    return res.json(tenant);
  }

  async getMe(req: Request, res: Response) {
    const tenantId = req.user!.tenantId;

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        plan: true,
      },
    });

    return res.json(tenant);
  }

  async update(req: Request, res: Response) {
    const tenantId = req.user!.tenantId;
    const data = req.body;

    const tenant = await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        businessName: data.businessName,
        phone: data.phone,
        whatsappNumber: data.whatsappNumber,
        logo: data.logo,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        street: data.street,
        number: data.number,
        district: data.district,
        zipCode: data.zipCode,
        city: data.city,
        state: data.state,
      },
    });

    return res.json(tenant);
  }

  async updateSchedule(req: Request, res: Response) {
    const tenantId = req.user!.tenantId;
    const { schedule } = req.body;

    const tenant = await prisma.tenant.update({
      where: { id: tenantId },
      data: { schedule },
    });

    return res.json(tenant);
  }
}
