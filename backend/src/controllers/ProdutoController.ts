import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import { ErroApp } from '../middlewares/tratadorErros';
import { getImageUrl, deleteImageFile } from '../middlewares/uploadMiddleware';

const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.union([z.number().positive(), z.string()]).transform((val) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    if (isNaN(num) || num <= 0) throw new Error('Price must be positive');
    return num;
  }),
  categoryId: z.string().min(1),
  tags: z.union([z.array(z.string()), z.undefined()]).optional(),
  available: z.union([z.boolean(), z.string()]).transform((val) => {
    if (typeof val === 'string') return val === 'true';
    return val;
  }).optional().default(true),
  stock: z.union([z.number(), z.string(), z.undefined()]).transform((val) => {
    if (val === undefined || val === '') return undefined;
    const num = typeof val === 'string' ? parseInt(val) : val;
    return isNaN(num) ? undefined : num;
  }).optional(),
  calories: z.union([z.number(), z.string(), z.undefined()]).transform((val) => {
    if (val === undefined || val === '') return undefined;
    const num = typeof val === 'string' ? parseInt(val) : val;
    return isNaN(num) ? undefined : num;
  }).optional(),
  ingredients: z.union([z.array(z.string()), z.undefined()]).optional(),
  allergens: z.union([z.array(z.string()), z.undefined()]).optional(),
});

export class ProdutoController {
  async create(req: Request & { file?: Express.Multer.File }, res: Response) {
    try {
      console.log('📸 Criando produto...');
      console.log('📦 Body recebido:', JSON.stringify(req.body, null, 2));
      console.log('📄 Arquivo:', req.file ? `${req.file.filename}` : 'nenhum arquivo');

      const data = createProductSchema.parse(req.body);
      console.log('✅ Schema validado:', JSON.stringify(data, null, 2));

      const tenantId = req.user!.tenantId;

      const slug = data.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      // Obter nome do arquivo se foi feito upload
      const imageFilename = req.file?.filename || null;
      console.log('🖼️  Imagem filename:', imageFilename);

      const product = await prisma.product.create({
        data: {
          ...data,
          image: imageFilename,
          slug,
          tenantId,
        },
        include: {
          category: true,
        },
      });

      console.log('✅ Produto criado com sucesso:', product.id);
      return res.status(201).json(product);
    } catch (error) {
      console.error('❌ Erro ao criar produto:', error);
      if (error instanceof z.ZodError) {
        console.error('❌ Erro de validação:', error.errors);
        return res.status(400).json({ error: 'Validação falhou', details: error.errors });
      }
      return res.status(500).json({ error: String(error) });
    }
  }

  async list(req: Request, res: Response) {
    const tenantId = req.user!.tenantId;
    const { categoryId, available } = req.query;

    const products = await prisma.product.findMany({
      where: {
        tenantId,
        ...(categoryId && { categoryId: String(categoryId) }),
        ...(available !== undefined && { available: available === 'true' }),
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.json(products);
  }

  async listPublic(req: Request, res: Response) {
    try {
      console.log('🔧 listPublic chamado');
      
      // Para API pública, buscar produtos do primeiro tenant ativo ou qualquer tenant
      let tenant = await prisma.tenant.findFirst({
        where: { status: 'ACTIVE' },
      });

      if (!tenant) {
        console.log('🔍 Nenhum tenant ativo encontrado, buscando qualquer um...');
        tenant = await prisma.tenant.findFirst();
      }

      if (!tenant) {
        console.log('⚠️ Nenhum tenant encontrado, retornando array vazio');
        return res.json([]);
      }

      console.log('📋 Buscando produtos para tenant:', tenant.businessName);
      
      const products = await prisma.product.findMany({
        where: {
          tenantId: tenant.id,
          available: true,
        },
        include: {
          category: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      console.log(`✅ Encontrados ${products.length} produtos`);
      
      // Formatar produtos com URL das imagens
      const formattedProducts = products.map(p => ({
        ...p,
        image: getImageUrl(p.image),
      }));
      
      return res.json(formattedProducts);
    } catch (error) {
      console.error('❌ Erro no listPublic:', error);
      return res.status(500).json({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;

    const product = await prisma.product.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new ErroApp('Product not found', 404);
    }

    return res.json(product);
  }

  async getBySlug(req: Request, res: Response) {
    const { slug } = req.params;
    const tenant = req.tenant;

    const product = await prisma.product.findFirst({
      where: {
        slug,
        tenantId: tenant.id,
      },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new ErroApp('Product not found', 404);
    }

    return res.json(product);
  }

  async update(req: Request & { file?: Express.Multer.File }, res: Response) {
    const { id } = req.params;
    const data = createProductSchema.partial().parse(req.body);
    const tenantId = req.user!.tenantId;

    const product = await prisma.product.findFirst({
      where: { id, tenantId },
    });

    if (!product) {
      throw new ErroApp('Product not found', 404);
    }

    // Se um novo arquivo foi enviado, deletar o antigo
    if (req.file && product.image) {
      deleteImageFile(product.image);
    }

    const updateData = {
      ...data,
      ...(req.file && { image: req.file.filename }),
    };

    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    });

    return res.json(updated);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;

    const product = await prisma.product.findFirst({
      where: { id, tenantId },
    });

    if (!product) {
      throw new ErroApp('Product not found', 404);
    }

    // Deletar arquivo de imagem se existir
    if (product.image) {
      deleteImageFile(product.image);
    }

    await prisma.product.delete({
      where: { id },
    });

    return res.status(204).send();
  }
}
