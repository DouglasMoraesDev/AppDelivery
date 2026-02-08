import { Router } from 'express';
import { ProdutoController } from '../controllers/ProdutoController';
import { CategoriaController } from '../controllers/CategoriaController';
import { tenantMiddleware } from '../middlewares/tenantMiddleware';

const router = Router();
const produtoController = new ProdutoController();
const categoriaController = new CategoriaController();

// Rota pública para listar categorias (sem tenant específico)
router.get('/categories', categoriaController.listPublic);

// Rota pública para listar produtos (sem tenant específico)
router.get('/products', produtoController.listPublic);

// Rotas públicas específicas por tenant
router.get('/:tenantSlug/categories', tenantMiddleware, categoriaController.listPublic);
router.get('/:tenantSlug/products', tenantMiddleware, produtoController.listPublic);
router.get('/:tenantSlug/products/:slug', tenantMiddleware, produtoController.getBySlug);

export default router;