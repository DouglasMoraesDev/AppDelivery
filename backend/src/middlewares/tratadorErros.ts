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
  });
}
