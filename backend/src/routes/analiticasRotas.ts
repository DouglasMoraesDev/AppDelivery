import { Router } from 'express';
import { AnaliticasController } from '../controllers/AnaliticasController';
import { autenticacaoMiddleware } from '../middlewares/autenticacaoMiddleware';

const analiticasRotas = Router();
const analiticasController = new AnaliticasController();

analiticasRotas.use(autenticacaoMiddleware);
analiticasRotas.get('/dashboard', analiticasController.getDashboard);
analiticasRotas.get('/period', analiticasController.getByPeriod);
analiticasRotas.get('/top-products', analiticasController.getTopProducts);
analiticasRotas.get('/detailed-report', analiticasController.getDetailedReport);

export { analiticasRotas };
