import { Router } from 'express';
import { ConfiguracaoController } from '../controllers/ConfiguracaoController';

const router = Router();
const configController = new ConfiguracaoController();

// Rota pública para obter configuração
router.get('/config', configController.getPublicConfig);

export default router;