# Gemini Burger - Sistema de Pedidos Multi-Tenant

Sistema completo de pedidos para restaurantes com integração WhatsApp e IA.

## 🚀 Desenvolvimento

### Pré-requisitos
- Node.js 18+ 
- MySQL 8.0
- npm ou yarn

### Setup Inicial

```bash
# 1. Instalar dependências
npm run setup

# 2. Configurar banco de dados
cd backend
cp .env.example .env  # Ajuste as configurações do banco
npx prisma migrate dev
npx prisma generate

# 3. Criar usuário admin (opcional)
npm run create-admin
```

### Rodar em Desenvolvimento

```bash
# Opção 1: Rodar backend e frontend juntos
npm run dev

# Opção 2: Rodar separadamente
npm run dev:backend  # Backend na porta 4000
npm run dev:frontend # Frontend na porta 3000
```

**URLs de Desenvolvimento:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api
- Admin Panel: http://localhost:3000 (clique no ícone de configuração)

## 🏭 Produção

### Build

```bash
# Build completo (frontend + backend integrado)
npm run build

# Build simples (separado)
npm run build:simple
```

### Deploy

```bash
# Rodar em produção (servidor único na porta 4000)
npm start

# Com Docker
docker-compose up -d
```

**URLs de Produção:**
- Aplicação completa: http://localhost:4000
- API: http://localhost:4000/api

## 📁 Estrutura

```
├── backend/          # API Node.js + Express
│   ├── src/
│   ├── uploads/      # Imagens enviadas
│   └── public/       # Frontend build (produção)
├── frontend/         # React + Vite
│   └── dist/         # Build de produção
└── docker-compose.yml # Configuração Docker
```

## 🔧 Configuração

### Variáveis de Ambiente

**Backend (`.env`):**
```env
DATABASE_URL="mysql://root:root@localhost:3306/gemini_burger"
JWT_SECRET="your-super-secret-jwt-key"
NODE_ENV="development"
PORT="4000"
CORS_ORIGIN="http://localhost:3000"
```

**Frontend (`frontend/.env`):**
```env
VITE_API_URL="http://localhost:4000/api"
VITE_GEMINI_API_KEY="your-gemini-api-key"
```

## 🎯 Features

- ✅ Sistema Multi-tenant
- ✅ Painel Admin completo
- ✅ Cardápio público responsivo
- ✅ Integração WhatsApp
- ✅ IA para recomendações (Gemini)
- ✅ Upload de imagens
- ✅ Gestão de pedidos
- ✅ Analytics e relatórios
- ✅ Rate limiting e segurança

## 📱 Uso

1. **Admin**: Acesse http://localhost:3000 e clique no ícone de configuração
2. **Cliente**: Navegue pelo cardápio e faça pedidos via WhatsApp
3. **Multi-tenant**: Cada restaurante tem seu próprio subdomínio/slug

---

**Desenvolvido para facilitar o desenvolvimento e deployment em produção como serviço único.**