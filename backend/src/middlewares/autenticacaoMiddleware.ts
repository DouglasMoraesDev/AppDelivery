import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ErroApp } from './tratadorErros';

interface TokenPayload {
  sub: string;
  tenantId: string;
  role: string;
}

export function autenticacaoMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new ErroApp('Token not provided', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;

    req.user = {
      id: decoded.sub,
      tenantId: decoded.tenantId,
      role: decoded.role,
    };

    return next();
  } catch {
    throw new ErroApp('Invalid token', 401);
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        tenantId: string;
        role: string;
      };
    }
  }
}
