# 🏗️ GUIA DE ARQUITETURA - Gemini Burger

## 📐 **ARQUITETURA GERAL**

Este projeto segue uma arquitetura **Multi-Tenant SaaS**, onde:

- **1 Backend** serve múltiplos restaurantes
- Cada restaurante tem seu próprio **slug único** (ex: `geminiburger`, `xburger`)
- Dados isolados por `tenantId` em todas as queries
- Frontend é **white-label** (cores/logo customizáveis)

---

## 🔄 **FLUXO DE DADOS**

### **1. Cliente Faz Pedido (Frontend Público)**

```
Cliente acessa: geminiburger.seudominio.com
   ↓
Frontend busca config: GET /api/tenants/geminiburger/config
   ↓
Cliente monta pedido e finaliza
   ↓
POST /api/orders/geminiburger/create
   ↓
Backend cria pedido + cliente (se novo)
   ↓
Retorna dados do pedido
   ↓
Frontend abre WhatsApp com pedido formatado
```

### **2. Admin Gerencia Pedidos (Painel Admin)**

```
Admin faz login: POST /api/auth/login
   ↓
Recebe JWT token com tenantId
   ↓
Todas requests incluem: Authorization: Bearer {token}
   ↓
Middleware valida token e extrai tenantId
   ↓
Queries filtradas por tenantId automaticamente
```

---

## 🗄️ **ESTRATÉGIA MULTI-TENANT**

### **Tipo:** Row-Level Multi-Tenancy (Shared Database)

Todas as tabelas têm coluna `tenantId`:

```sql
SELECT * FROM products WHERE tenantId = 'tenant-uuid';
SELECT * FROM orders WHERE tenantId = 'tenant-uuid';
```

### **Vantagens:**
✅ Mais econômico (1 banco serve todos)  
✅ Mais fácil manutenção  
✅ Backups centralizados  

### **Desvantagens:**
⚠️ Precisa garantir isolamento (sempre filtrar por tenantId)  
⚠️ Queries podem ficar lentas com muitos tenants (usar índices)

### **Segurança:**
- Middleware `tenantMiddleware` identifica o tenant
- Middleware `authMiddleware` valida JWT e injeta `tenantId`
- Controllers SEMPRE filtram por `tenantId`

---

## 🎨 **FRONTEND - ESTRUTURA MODULAR**

```
frontend/src/
├── components/           # Componentes reutilizáveis
│   ├── Cart/
│   │   ├── Cart.tsx
│   │   ├── CartItem.tsx
│   │   └── CartButton.tsx
│   ├── Product/
│   │   ├── ProductCard.tsx
│   │   ├── ProductList.tsx
│   │   └── ProductModal.tsx
│   ├── Checkout/
│   │   ├── CheckoutForm.tsx
│   │   ├── AddressForm.tsx
│   │   └── PaymentForm.tsx
│   ├── UI/              # Componentes genéricos
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── Loading.tsx
│   └── Layout/
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── Container.tsx
│
├── services/            # Chamadas API
│   ├── api.ts           # Axios config
│   ├── productService.ts
│   ├── orderService.ts
│   ├── tenantService.ts
│   └── geminiService.ts
│
├── hooks/               # Custom hooks
│   ├── useCart.ts
│   ├── useProducts.ts
│   ├── useOrders.ts
│   └── useTenant.ts
│
├── types/               # TypeScript types
│   ├── product.ts
│   ├── order.ts
│   ├── cart.ts
│   └── tenant.ts
│
├── constants/           # Configurações
│   ├── index.ts
│   └── categories.ts
│
├── utils/               # Helpers
│   ├── formatters.ts    # Formatação de preço, data
│   ├── validators.ts    # Validações
│   └── whatsapp.ts      # Gerar mensagem WhatsApp
│
├── App.tsx              # Componente raiz
└── main.tsx             # Entry point
```

---

## 🔌 **BACKEND - CAMADAS**

```
Request → Middleware → Route → Controller → Service → Database
```

### **1. Middlewares**
- `errorHandler` - Captura erros globais
- `authMiddleware` - Valida JWT, injeta `req.user`
- `tenantMiddleware` - Identifica tenant pelo slug/header

### **2. Routes**
Define endpoints e aplica middlewares:
```typescript
router.get('/products', authMiddleware, productController.list);
router.post('/products/:tenantSlug/public', tenantMiddleware, productController.listPublic);
```

### **3. Controllers**
Lógica de negócio, validações com Zod:
```typescript
const data = createProductSchema.parse(req.body);
const product = await prisma.product.create({ data });
return res.json(product);
```

### **4. Services** (opcional)
Lógica complexa separada:
- `GeminiService` - Comunicação com IA
- `WhatsAppService` - Envio de mensagens
- `PaymentService` - Integração Mercado Pago/Stripe

---

## 🔐 **AUTENTICAÇÃO E AUTORIZAÇÃO**

### **JWT Payload:**
```json
{
  "sub": "user-uuid",        // ID do usuário
  "tenantId": "tenant-uuid", // ID do restaurante
  "role": "OWNER",           // OWNER | ADMIN | MANAGER
  "iat": 1234567890,
  "exp": 1234567890
}
```

### **Fluxo:**
1. POST `/api/auth/register` → Cria tenant + user
2. POST `/api/auth/login` → Retorna JWT
3. Frontend armazena token (localStorage/cookie)
4. Todas requests incluem: `Authorization: Bearer {token}`
5. Middleware valida e injeta `req.user`

### **Roles:**
- **OWNER** - Dono, acesso total
- **ADMIN** - Gerente, pode tudo exceto excluir tenant
- **MANAGER** - Operador, só visualiza/edita pedidos

---

## 📊 **ANALYTICS E MÉTRICAS**

### **Tabela `analytics`:**
Guarda métricas diárias agregadas:

```typescript
{
  date: "2026-01-03",
  totalOrders: 45,
  totalRevenue: 1890.50,
  avgOrderValue: 42.01,
  newCustomers: 12,
  returningCustomers: 33
}
```

### **Cálculo:**
- Job diário (cron) processa pedidos do dia anterior
- Agrega dados e salva em `analytics`
- Dashboard consulta `analytics` para ser rápido

---

## 🚀 **DEPLOY**

### **Backend:**
- **Railway** / **Render** / **Heroku** - Deploy fácil
- **AWS EC2** - Mais controle
- **Docker** - Container com Node + Prisma

### **Frontend:**
- **Vercel** - Deploy automático do React
- **Netlify** - Alternativa
- **Cloudflare Pages** - CDN global

### **Banco:**
- **PlanetScale** - MySQL serverless (grátis até 5GB)
- **Railway** - MySQL gerenciado
- **AWS RDS** - Produção robusta

### **White-label Domains:**
```
geminiburger.seudominio.com → Frontend
xburger.seudominio.com      → Frontend (mesmo código)
api.seudominio.com          → Backend
```

Configurar wildcard DNS: `*.seudominio.com`

---

## 🎯 **ROADMAP DE DESENVOLVIMENTO**

### **MVP (2-3 semanas):**
- [x] Backend completo
- [x] Schema Prisma
- [x] Autenticação JWT
- [x] CRUD produtos/pedidos
- [ ] Reorganizar frontend modular
- [ ] Integrar frontend com backend
- [ ] Deploy básico

### **v1.0 (1 mês):**
- [ ] Painel admin React
- [ ] Dashboard analytics
- [ ] Upload de imagens
- [ ] Integração pagamento (Mercado Pago)
- [ ] Email confirmação pedido
- [ ] Testes automatizados

### **v2.0 (2-3 meses):**
- [ ] App mobile (React Native)
- [ ] Websockets (pedidos tempo real)
- [ ] Sistema de cupons avançado
- [ ] Programa de fidelidade
- [ ] Integração iFood/Uber Eats
- [ ] White-label completo

---

## 💰 **CUSTOS ESTIMADOS**

**Infraestrutura (mensal):**
- Banco MySQL (PlanetScale): **Grátis** → $39
- Backend (Railway): **Grátis** → $20
- Frontend (Vercel): **Grátis** → $20
- Domínio: $10-15/ano
- Email (SendGrid): **Grátis** → $15
- Storage S3: ~$5

**Total:** Grátis (início) → $100/mês (escala)

**Receita potencial:**
- 10 clientes × R$ 99 = **R$ 990/mês**
- 50 clientes × R$ 149 (média) = **R$ 7.450/mês**
- 100 clientes × R$ 179 (média) = **R$ 17.900/mês**

---

## 📚 **RECURSOS ADICIONAIS**

- [Prisma Docs](https://www.prisma.io/docs)
- [React + TypeScript](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Express.js](https://expressjs.com)
- [JWT Best Practices](https://jwt.io)

---

**Última atualização:** 03/01/2026
