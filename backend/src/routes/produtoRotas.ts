import { Router } from 'express';
import { ProdutoController } from '../controllers/ProdutoController';
import { autenticacaoMiddleware } from '../middlewares/autenticacaoMiddleware';
import { tenantMiddleware } from '../middlewares/tenantMiddleware';

const produtoRotas = Router();
const produtoController = new ProdutoController();

// Public routes (para o cardápio público)
produtoRotas.get('/:tenantSlug/public', tenantMiddleware, produtoController.listPublic);
produtoRotas.get('/:tenantSlug/public/:slug', tenantMiddleware, produtoController.getBySlug);

// Protected routes (para admin gerenciar produtos)
produtoRotas.use(autenticacaoMiddleware);
produtoRotas.post('/', produtoController.create);
produtoRotas.get('/', produtoController.list);
produtoRotas.get('/:id', produtoController.getById);
produtoRotas.put('/:id', produtoController.update);
produtoRotas.delete('/:id', produtoController.delete);

export { produtoRotas };
