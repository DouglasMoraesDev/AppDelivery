import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class ErroApp extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400
  ) {
    super(message);
  }
}

export function tratadorErros(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(`❌ Erro em ${req.method} ${req.path}:`, error);
  console.error('   Erro type:', error.constructor.name);
  console.error('   Erro message:', error.message);

  // Erros do Multer (upload)
  if (error.name === 'MulterError') {
    const multerError = error as any;
    console.error('   Multer error code:', multerError.code);
    
    if (multerError.code === 'FILE_TOO_LARGE') {
      return res.status(413).json({
        error: 'Arquivo muito grande. Máximo 2MB.',
      });
    }
    
    if (multerError.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: 'Apenas um arquivo é permitido.',
      });
    }

    return res.status(400).json({
      error: 'Erro no upload do arquivo.',
      details: multerError.message,
    });
  }

  if (error instanceof ErroApp) {
    return res.status(error.statusCode).json({
      error: error.message,
    });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation error',
      details: error.errors,
    });
  }

  console.error('Internal server error:', error);
  
  return res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : undefined,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
  });
}
