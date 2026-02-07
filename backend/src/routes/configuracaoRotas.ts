import { Router } from 'express';
import { ConfiguracaoController } from '../controllers/ConfiguracaoController';
import { autenticacaoMiddleware } from '../middlewares/autenticacaoMiddleware';
import { uploadSingle } from '../middlewares/uploadMiddleware';

const router = Router();
const controller = new ConfiguracaoController();

// Aplicar middleware de autenticação
router.use(autenticacaoMiddleware);

// Rotas de configuração
router.get('/', controller.getConfig);
router.put('/', controller.updateConfig);
router.post('/upload-image', uploadSingle, controller.uploadImage);

export default router;
