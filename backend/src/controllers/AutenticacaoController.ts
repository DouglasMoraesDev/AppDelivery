import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { ErroApp } from '../middlewares/tratadorErros';

const registerSchema = z.object({
  businessName: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string(),
  whatsappNumber: z.string(),
  city: z.string(),
  state: z.string(),
  planId: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export class AutenticacaoController {
  async register(req: Request, res: Response) {
    const data = registerSchema.parse(req.body);

    const userExists = await prisma.user.findFirst({
      where: { email: data.email },
    });

    if (userExists) {
      throw new ErroApp('Email already in use', 409);
    }

    // Gerar slug único
    const slug = data.businessName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const slugExists = await prisma.tenant.findUnique({
      where: { slug },
    });

    if (slugExists) {
      throw new ErroApp('Business name already taken', 409);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Buscar plano básico
    let plan = await prisma.plan.findFirst({
      where: { name: 'Basic' },
    });

    if (!plan) {
      // Criar plano básico se não existir
      plan = await prisma.plan.create({
        data: {
          name: 'Basic',
          price: 99,
          maxProducts: 50,
          maxOrders: 500,
          features: ['ai_suggestions', 'whatsapp_integration'],
        },
      });
    }

    // Criar tenant e usuário
    const tenant = await prisma.tenant.create({
      data: {
        slug,
        businessName: data.businessName,
        email: data.email,
        phone: data.phone,
        whatsappNumber: data.whatsappNumber,
        city: data.city,
        state: data.state,
        planId: data.planId || plan.id,
        status: 'TRIAL',
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 dias
        schedule: {
          monday: { open: '18:00', close: '23:00' },
          tuesday: { open: '18:00', close: '23:00' },
          wednesday: { open: '18:00', close: '23:00' },
          thursday: { open: '18:00', close: '23:00' },
          friday: { open: '18:00', close: '23:30' },
          saturday: { open: '18:00', close: '23:30' },
          sunday: { open: '18:00', close: '22:00' },
        },
        users: {
          create: {
            name: data.businessName,
            email: data.email,
            password: hashedPassword,
            role: 'OWNER',
          },
        },
      },
      include: {
        users: true,
      },
    });

    const token = jwt.sign(
      {
        sub: tenant.users[0].id,
        tenantId: tenant.id,
        role: tenant.users[0].role,
      },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      tenant: {
        id: tenant.id,
        slug: tenant.slug,
        businessName: tenant.businessName,
        status: tenant.status,
      },
      user: {
        id: tenant.users[0].id,
        name: tenant.users[0].name,
        email: tenant.users[0].email,
        role: tenant.users[0].role,
      },
      token,
    });
  }

  async login(req: Request, res: Response) {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findFirst({
      where: { email },
      include: { tenant: true },
    });

    if (!user) {
      throw new ErroApp('Invalid credentials', 401);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new ErroApp('Invalid credentials', 401);
    }

    const token = jwt.sign(
      {
        sub: user.id,
        tenantId: user.tenantId,
        role: user.role,
      },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '7d' }
    );

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      tenant: {
        id: user.tenant.id,
        slug: user.tenant.slug,
        businessName: user.tenant.businessName,
      },
      token,
    });
  }

  async refresh(req: Request, res: Response) {
    // Implementar refresh token se necessário
    return res.json({ message: 'Not implemented' });
  }
}
