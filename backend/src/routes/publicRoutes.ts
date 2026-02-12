import { Router } from 'express';
import { ConfiguracaoController } from '../controllers/ConfiguracaoController';
import { PedidoPublicoController } from '../controllers/PedidoPublicoController';

const router = Router();
const configController = new ConfiguracaoController();
const pedidoPublicoController = new PedidoPublicoController();

// Rota pública para obter configuração
router.get('/config', configController.getPublicConfig);

// Rotas públicas de pedidos (sem autenticação)
router.post('/orders', pedidoPublicoController.createPublic);
router.get('/orders/by-phone/:phone', pedidoPublicoController.listByPhone);
router.get('/orders/:orderNumber', pedidoPublicoController.getByOrderNumber);

export default router;