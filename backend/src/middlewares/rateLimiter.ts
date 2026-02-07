import rateLimit from 'express-rate-limit';

// Rate limiter geral - 100 requisições por minuto por IP
export const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'), // 1 minuto
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // 100 requisições
  message: {
    error: 'Muitas requisições deste IP. Tente novamente em alguns minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter para autenticação - mais restritivo
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 tentativas de login
  message: {
    error: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
  },
  skipSuccessfulRequests: true, // Não conta requisições bem-sucedidas
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter para pedidos - previne spam
export const orderLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 10, // 10 pedidos
  message: {
    error: 'Muitos pedidos em pouco tempo. Aguarde alguns minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter para API pública - mais permissivo
export const publicLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 200, // 200 requisições
  message: {
    error: 'Limite de requisições excedido. Aguarde um momento.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
