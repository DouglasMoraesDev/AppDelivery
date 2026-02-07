import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { ErroApp } from './tratadorErros';

/**
 * Middleware para identificar o tenant baseado no subdomínio ou header
 * Exemplo: geminiburger.seu-dominio.com -> slug = "geminiburger"
 * Ou via header: X-Tenant-Slug: geminiburger
 */
export async function tenantMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const tenantSlug = req.headers['x-tenant-slug'] as string || 
                     req.params.tenantSlug ||
                     extractSlugFromHost(req.hostname);

  if (!tenantSlug) {
    throw new ErroApp('Tenant not identified', 400);
  }

  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
    include: { plan: true },
  });

  if (!tenant) {
    throw new ErroApp('Tenant not found', 404);
  }

  if (tenant.status !== 'ACTIVE' && tenant.status !== 'TRIAL') {
    throw new ErroApp('Tenant is not active', 403);
  }

  req.tenant = tenant;

  return next();
}

function extractSlugFromHost(hostname: string): string {
  // geminiburger.domain.com -> geminiburger
  const parts = hostname.split('.');
  if (parts.length > 2) {
    return parts[0];
  }
  return '';
}

declare global {
  namespace Express {
    interface Request {
      tenant?: any;
    }
  }
}
