import { Router } from 'express';
import { TenantController } from '../controllers/TenantController';
import { autenticacaoMiddleware } from '../middlewares/autenticacaoMiddleware';

const tenantRotas = Router();
const tenantController = new TenantController();

// Public
tenantRotas.get('/:slug/config', tenantController.getPublicConfig);

// Protected
tenantRotas.use(autenticacaoMiddleware);
tenantRotas.get('/me', tenantController.getMe);
tenantRotas.put('/me', tenantController.update);
tenantRotas.put('/me/schedule', tenantController.updateSchedule);

export { tenantRotas };
