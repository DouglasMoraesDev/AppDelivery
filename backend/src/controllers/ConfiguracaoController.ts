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

  async getPublicConfig(req: Request, res: Response) {
    try {
      console.log('🔧 getPublicConfig chamado');
      
      // Primeiro tenta buscar um tenant ativo, se não encontrar, pega qualquer um
      let tenant = await prisma.tenant.findFirst({
        where: { status: 'ACTIVE' },
        select: {
          businessName: true,
          phone: true,
          whatsappNumber: true,
          logo: true,
          banner: true,
          primaryColor: true,
          secondaryColor: true,
          accentColor: true,
          textColor: true,
          bgColor: true,
          isOpen: true,
          schedule: true,
        },
      });

      // Se não encontrou tenant ativo, pega o primeiro que encontrar
      if (!tenant) {
        console.log('🔍 Nenhum tenant ativo encontrado, buscando qualquer um...');
        tenant = await prisma.tenant.findFirst({
          select: {
            businessName: true,
            phone: true,
            whatsappNumber: true,
            logo: true,
            banner: true,
            primaryColor: true,
            secondaryColor: true,
            accentColor: true,
            textColor: true,
            bgColor: true,
            isOpen: true,
            schedule: true,
          },
        });
      }

      // Se ainda não encontrou, retorna configuração padrão
      if (!tenant) {
        console.log('⚠️ Nenhum tenant encontrado, retornando config padrão');
        return res.json({
          businessName: 'Demo Restaurant',
          phone: '(11) 99999-9999',
          whatsappNumber: '5511999999999',
          logo: null,
          banner: null,
          primaryColor: '#ea580c',
          secondaryColor: '#18181b',
          accentColor: '#f97316',
          textColor: '#ffffff',
          bgColor: '#0a0a0a',
          isOpen: true,
          schedule: {
            monday: { open: '18:00', close: '23:00', closed: false },
            tuesday: { open: '18:00', close: '23:00', closed: false },
            wednesday: { open: '18:00', close: '23:00', closed: false },
            thursday: { open: '18:00', close: '23:00', closed: false },
            friday: { open: '18:00', close: '23:00', closed: false },
            saturday: { open: '18:00', close: '23:00', closed: false },
            sunday: { open: '18:00', close: '23:00', closed: false }
          }
        });
      }

      console.log('✅ Tenant encontrado para config pública:', tenant.businessName);
      res.json(tenant);
    } catch (error) {
      console.error('❌ Erro no getPublicConfig:', error);
      res.status(500).json({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async updateConfig(req: Request, res: Response) {
    try {
      const tenantId = req.user!.tenantId;
      console.log('🔧 updateConfig chamado para tenant:', tenantId);
      console.log('📦 Body recebido completo:', req.body);
      console.log('📦 Keys do body:', Object.keys(req.body));
      
      // Listar cada campo recebido
      for (const [key, value] of Object.entries(req.body)) {
        console.log(`  - ${key}: ${typeof value} = ${JSON.stringify(value)}`);
      }
      
      // Filtrar apenas campos válidos e não undefined
      const validData: any = {};
      const validFields = ['businessName', 'phone', 'whatsappNumber', 'logo', 'banner', 'primaryColor', 'secondaryColor', 'accentColor', 'textColor', 'bgColor', 'zipCode', 'street', 'number', 'district', 'city', 'state', 'schedule', 'isOpen', 'geminiApiKey', 'aiEnabled'];
      
      for (const field of validFields) {
        if (field in req.body) {
          const value = req.body[field];
          if (value !== undefined && value !== null) {
            validData[field] = value;
            console.log(`  ✅ Campo válido: ${field} = ${JSON.stringify(value)}`);
          } else {
            console.log(`  ⚠️ Campo ${field} é ${value === undefined ? 'undefined' : 'null'}, ignorando`);
          }
        }
      }
      
      console.log('✅ Dados filtrados:', validData);
      
      const data = updateConfigSchema.parse(validData);
      console.log('✅ Schema validado:', data);

      console.log('🔄 Iniciando update do Prisma...');
      const tenant = await prisma.tenant.update({
        where: { id: tenantId },
        data: data,
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

      console.log('✅ Configuração atualizada:', tenant.businessName);
      res.json(tenant);
    } catch (error) {
      console.error('❌ Erro no updateConfig - Stack completo:');
      console.error(error);
      if (error instanceof z.ZodError) {
        console.error('❌ Erro de validação Zod:', error.errors);
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      res.status(500).json({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async uploadImage(req: Request & { file?: Express.Multer.File }, res: Response) {
    try {
      const tenantId = req.user!.tenantId;
      const file = req.file;
      const { type } = req.body;

      console.log('📤 uploadImage chamado:');
      console.log('   File:', file ? file.filename : 'nenhum');
      console.log('   Type:', type);

      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      if (!type || !['logo', 'banner'].includes(type)) {
        return res.status(400).json({ error: 'Invalid type. Use "logo" or "banner"' });
      }

      // URL da imagem
      const imageUrl = `/uploads/${file.filename}`;
      console.log('🖼️  URL da imagem:', imageUrl);

      const updateData: any = {};
      if (type === 'logo') {
        updateData.logo = imageUrl;
      } else if (type === 'banner') {
        updateData.banner = imageUrl;
      }

      const tenant = await prisma.tenant.update({
        where: { id: tenantId },
        data: updateData,
        select: {
          logo: true,
          banner: true,
        }
      });

      console.log('✅ Imagem salva com sucesso');
      res.json({ 
        url: imageUrl,
        type,
        message: 'Image uploaded successfully'
      });
    } catch (error) {
      console.error('❌ Erro no uploadImage:', error);
      res.status(500).json({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
}
