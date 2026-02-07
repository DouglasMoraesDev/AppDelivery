import { Router } from 'express';
import { ClienteController } from '../controllers/ClienteController';
import { autenticacaoMiddleware } from '../middlewares/autenticacaoMiddleware';

const clienteRotas = Router();
const clienteController = new ClienteController();

clienteRotas.use(autenticacaoMiddleware);
clienteRotas.get('/', clienteController.list);
clienteRotas.get('/:id', clienteController.getById);
clienteRotas.get('/:id/orders', clienteController.getOrders);

export { clienteRotas };
