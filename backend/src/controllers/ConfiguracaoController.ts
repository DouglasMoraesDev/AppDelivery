import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

const updateConfigSchema = z.object({
  businessName: z.string().optional(),
  phone: z.string().optional(),
  whatsappNumber: z.string().optional(),
  logo: z.string().optional(),
  banner: z.string().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  textColor: z.string().optional(),
  bgColor: z.string().optional(),
  zipCode: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  district: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  schedule: z.any().optional(),
  isOpen: z.boolean().optional(),
  geminiApiKey: z.string().optional(),
  aiEnabled: z.boolean().optional(),
});

export class ConfiguracaoController {
  async getConfig(req: Request, res: Response) {
    try {
      console.log('🔧 getConfig chamado');
      console.log('📝 req.user:', req.user);
      
      const tenantId = req.user!.tenantId;
      console.log('🆔 tenantId:', tenantId);

      const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
        select: {
          id: true,
          slug: true,
          businessName: true,
          email: true,
          phone: true,
          whatsappNumber: true,
          logo: true,
          banner: true,
          primaryColor: true,
          secondaryColor: true,
          accentColor: true,
          textColor: true,
          bgColor: true,
          zipCode: true,
          street: true,
          number: true,
          district: true,
          city: true,
          state: true,
          schedule: true,
          isOpen: true,
          aiEnabled: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!tenant) {
        console.log('❌ Tenant não encontrado');
        return res.status(404).json({ error: 'Tenant not found' });
      }

      console.log('✅ Tenant encontrado:', tenant.businessName);
      res.json(tenant);
    } catch (error) {
      console.error('❌ Erro no getConfig:', error);
      res.status(500).json({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async updateConfig(req: Request, res: Response) {
    const tenantId = req.user!.tenantId;
    const data = updateConfigSchema.parse(req.body);

    const tenant = await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        ...data,
      },
      select: {
        id: true,
        slug: true,
        businessName: true,
        email: true,
        phone: true,
        whatsappNumber: true,
        logo: true,
        banner: true,
        primaryColor: true,
        secondaryColor: true,
        accentColor: true,
        textColor: true,
        bgColor: true,
        zipCode: true,
        street: true,
        number: true,
        district: true,
        city: true,
        state: true,
        schedule: true,
        isOpen: true,
        aiEnabled: true,
        status: true,
        updatedAt: true,
      },
    });

    res.json(tenant);
  }

  async uploadImage(req: Request, res: Response) {
    const tenantId = req.user!.tenantId;
    const file = req.file;
    const { type } = req.body;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!type || !['logo', 'banner'].includes(type)) {
      return res.status(400).json({ error: 'Invalid type. Use "logo" or "banner"' });
    }

    // URL da imagem (em produção, usar CDN ou storage service)
    const imageUrl = `/uploads/${file.filename}`;

    const updateData: any = {};
    if (type === 'logo') {
      updateData.logo = imageUrl;
    } else if (type === 'banner') {
      updateData.banner = imageUrl;
    }

    await prisma.tenant.update({
      where: { id: tenantId },
      data: updateData,
    });

    res.json({ success: true, url: imageUrl });
  }
}
