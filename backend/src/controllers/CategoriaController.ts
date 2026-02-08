import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import { ErroApp } from '../middlewares/tratadorErros';

const createCategorySchema = z.object({
  name: z.string(),
  icon: z.string().optional(),
  order: z.number().optional(),
});

export class CategoriaController {
  async create(req: Request, res: Response) {
    const data = createCategorySchema.parse(req.body);
    const tenantId = req.user!.tenantId;

    const slug = data.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const category = await prisma.category.create({
      data: {
        ...data,
        slug,
        tenantId,
      },
    });

    return res.status(201).json(category);
  }

  async list(req: Request, res: Response) {
    const tenantId = req.user!.tenantId;

    const categories = await prisma.category.findMany({
      where: { tenantId },
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { order: 'asc' },
    });

    return res.json(categories);
  }

  async listPublic(req: Request, res: Response) {
    try {
      // Obter tenant do middleware ou buscar o primeiro ativo
      let tenant = req.tenant;
      
      if (!tenant) {
        // Para API pública sem tenantSlug específico, buscar primeiro tenant ativo
        tenant = await prisma.tenant.findFirst({
          where: { status: 'ACTIVE' },
        });
        
        if (!tenant) {
          tenant = await prisma.tenant.findFirst();
        }
      }

      if (!tenant) {
        return res.json([]);
      }

      const categories = await prisma.category.findMany({
        where: {
          tenantId: tenant.id,
          active: true,
        },
        orderBy: { order: 'asc' },
      });

      return res.json(categories);
    } catch (error) {
      console.error('❌ Erro ao listar categorias públicas:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const data = createCategorySchema.partial().parse(req.body);
    const tenantId = req.user!.tenantId;

    const category = await prisma.category.findFirst({
      where: { id, tenantId },
    });

    if (!category) {
      throw new ErroApp('Category not found', 404);
    }

    const updated = await prisma.category.update({
      where: { id },
      data,
    });

    return res.json(updated);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;

    const category = await prisma.category.findFirst({
      where: { id, tenantId },
    });

    if (!category) {
      throw new ErroApp('Category not found', 404);
    }

    await prisma.category.delete({
      where: { id },
    });

    return res.status(204).send();
  }
}
