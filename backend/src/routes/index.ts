import { Router } from 'express';
import { tenantRotas } from './tenantRotas';
import { autenticacaoRotas } from './autenticacaoRotas';
import { produtoRotas } from './produtoRotas';
import { pedidoRotas } from './pedidoRotas';
import { categoriaRotas } from './categoriaRotas';
import { clienteRotas } from './clienteRotas';
import { analiticasRotas } from './analiticasRotas';
import configuracaoRotas from './configuracaoRotas';
import publicRoutes from './publicRoutes';
import publicProductRoutes from './publicProductRoutes';

const routes = Router();

// Rotas públicas (sem autenticação)
routes.use('/public', publicRoutes);
routes.use('/public', publicProductRoutes);

// Rotas autenticadas
routes.use('/auth', autenticacaoRotas);
routes.use('/tenants', tenantRotas);
routes.use('/products', produtoRotas);
routes.use('/categories', categoriaRotas);
routes.use('/orders', pedidoRotas);
routes.use('/customers', clienteRotas);
routes.use('/analytics', analiticasRotas);
routes.use('/config', configuracaoRotas);

export { routes };
