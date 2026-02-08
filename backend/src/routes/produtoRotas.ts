import { Router } from 'express';
import { ProdutoController } from '../controllers/ProdutoController';
import { autenticacaoMiddleware } from '../middlewares/autenticacaoMiddleware';
import { uploadSingle } from '../middlewares/uploadMiddleware';

const produtoRotas = Router();
const produtoController = new ProdutoController();

// Protected routes (para admin gerenciar produtos)
produtoRotas.use(autenticacaoMiddleware);
produtoRotas.post('/', uploadSingle, produtoController.create);
produtoRotas.get('/', produtoController.list);
produtoRotas.get('/:id', produtoController.getById);
produtoRotas.put('/:id', uploadSingle, produtoController.update);
produtoRotas.delete('/:id', produtoController.delete);

export { produtoRotas };
