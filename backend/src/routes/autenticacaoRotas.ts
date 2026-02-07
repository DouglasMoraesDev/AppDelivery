import { Router } from 'express';
import { AutenticacaoController } from '../controllers/AutenticacaoController';
import { authLimiter } from '../middlewares/rateLimiter';

const autenticacaoRotas = Router();
const autenticacaoController = new AutenticacaoController();

// Aplicar rate limiting nas rotas de autenticação
autenticacaoRotas.post('/register', authLimiter, autenticacaoController.register);
autenticacaoRotas.post('/login', authLimiter, autenticacaoController.login);
autenticacaoRotas.post('/refresh', authLimiter, autenticacaoController.refresh);

export { autenticacaoRotas };
