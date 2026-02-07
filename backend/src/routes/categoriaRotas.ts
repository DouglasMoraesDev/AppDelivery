import { Router } from 'express';
import { CategoriaController } from '../controllers/CategoriaController';
import { autenticacaoMiddleware } from '../middlewares/autenticacaoMiddleware';
import { tenantMiddleware } from '../middlewares/tenantMiddleware';

const categoriaRotas = Router();
const categoriaController = new CategoriaController();

// Public
categoriaRotas.get('/:tenantSlug/public', tenantMiddleware, categoriaController.listPublic);

// Protected
categoriaRotas.use(autenticacaoMiddleware);
categoriaRotas.post('/', categoriaController.create);
categoriaRotas.get('/', categoriaController.list);
categoriaRotas.put('/:id', categoriaController.update);
categoriaRotas.delete('/:id', categoriaController.delete);

export { categoriaRotas };
