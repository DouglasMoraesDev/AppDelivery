# 🚀 QUICK START GUIDE

## 📋 **PRÉ-REQUISITOS**

Antes de começar, instale:

- [x] **Node.js** (v18+) - https://nodejs.org
- [x] **MySQL** (v8+) - https://dev.mysql.com/downloads/ ou Docker
- [x] **Git** - https://git-scm.com

---

## ⚡ **SETUP EM 5 MINUTOS**

### **1️⃣ Banco de Dados MySQL**

**Opção A: Docker (Recomendado)**
```bash
docker run --name gemini-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=gemini_burger \
  -p 3306:3306 \
  -d mysql:8
```

**Opção B: MySQL Local**
```sql
CREATE DATABASE gemini_burger;
```

---

### **2️⃣ Backend**

```bash
# Entrar na pasta
cd backend

# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env

# Editar .env e configurar:
# DATABASE_URL="mysql://root:root@localhost:3306/gemini_burger"

# Gerar Prisma Client
npx prisma generate

# Criar tabelas no banco
npx prisma migrate dev --name init

# Iniciar servidor
npm run dev
```

✅ Backend rodando em **http://localhost:3333**

**Testar:**
```bash
curl http://localhost:3333/health
# Deve retornar: {"status":"ok","timestamp":"..."}
```

---

### **3️⃣ Frontend** (Atual - ainda não modularizado)

```bash
# Voltar para raiz
cd ..

# Instalar dependências
npm install

# Criar .env.local
echo "VITE_GEMINI_API_KEY=sua-chave-aqui" > .env.local

# Iniciar dev server
npm run dev
```

✅ Frontend rodando em **http://localhost:5173**

---

## 🧪 **TESTAR A API**

### **1. Criar um Restaurante (Tenant)**

```bash
curl -X POST http://localhost:3333/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "Gemini Burger",
    "email": "admin@geminiburger.com",
    "password": "123456",
    "phone": "12997775889",
    "whatsappNumber": "12997775889",
    "city": "São Paulo",
    "state": "SP"
  }'
```

**Resposta:**
```json
{
  "tenant": {
    "id": "...",
    "slug": "gemini-burger",
    "businessName": "Gemini Burger",
    "status": "TRIAL"
  },
  "user": {
    "id": "...",
    "name": "Gemini Burger",
    "email": "admin@geminiburger.com",
    "role": "OWNER"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Salve o TOKEN!** Você vai usar em todas as requisições de admin.

---

### **2. Criar Categoria**

```bash
curl -X POST http://localhost:3333/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "name": "Hambúrgueres",
    "icon": "🍔",
    "order": 1
  }'
```

---

### **3. Criar Produto**

```bash
curl -X POST http://localhost:3333/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "name": "Gemini Prime",
    "description": "Blend bovino 180g, queijo cheddar artesanal",
    "price": 38.90,
    "categoryId": "ID_DA_CATEGORIA",
    "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    "tags": ["Best Seller"],
    "available": true
  }'
```

---

### **4. Listar Produtos (Público)**

```bash
curl http://localhost:3333/api/products/gemini-burger/public
```

**Não precisa de autenticação!** É a rota que o frontend usa.

---

### **5. Criar Pedido (Público)**

```bash
curl -X POST http://localhost:3333/api/orders/gemini-burger/create \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "João Silva",
    "phone": "11999999999",
    "email": "joao@example.com",
    "type": "DELIVERY",
    "deliveryAddress": {
      "street": "Rua Exemplo",
      "number": "123",
      "district": "Centro",
      "zipCode": "01234-567"
    },
    "paymentMethod": "PIX",
    "items": [
      {
        "productId": "ID_DO_PRODUTO",
        "quantity": 2
      }
    ]
  }'
```

---

## 🎨 **PRÓXIMO PASSO: REORGANIZAR FRONTEND**

O frontend atual (`App.tsx` com 684 linhas) precisa ser modularizado.

### **Quer que eu faça isso agora?**

Vou dividir em:
- `components/Cart/` - Carrinho
- `components/Product/` - Cards de produtos
- `components/Checkout/` - Formulário de checkout
- `services/api.ts` - Chamadas ao backend
- `hooks/useCart.ts` - Lógica do carrinho
- etc.

**Responda:** "sim, reorganize o frontend"

---

## 📊 **PRISMA STUDIO (Visualizar Banco)**

```bash
cd backend
npx prisma studio
```

Abre em **http://localhost:5555** - Interface visual do banco!

---

## 🐛 **TROUBLESHOOTING**

### **Erro: "Can't reach database server"**
- Verifique se MySQL está rodando: `docker ps` ou `mysql -u root -p`
- Confirme `DATABASE_URL` no `.env`

### **Erro: "Table doesn't exist"**
```bash
cd backend
npx prisma migrate dev
```

### **Erro: "JWT_SECRET is not defined"**
Adicione no `backend/.env`:
```
JWT_SECRET=sua-chave-secreta-aqui-mude-em-producao
```

### **Erro: "Port 3333 already in use"**
```bash
# Windows
netstat -ano | findstr :3333
taskkill /PID NUMERO_DO_PID /F

# Linux/Mac
lsof -ti:3333 | xargs kill -9
```

---

## 📚 **DOCUMENTAÇÃO COMPLETA**

- [README.md](README.md) - Visão geral
- [ARCHITECTURE.md](ARCHITECTURE.md) - Arquitetura detalhada
- [SUMMARY.md](SUMMARY.md) - Resumo do que foi feito
- [Prisma Schema](backend/prisma/schema.prisma) - Modelo do banco

---

## ✅ **CHECKLIST DE SETUP**

- [ ] MySQL rodando
- [ ] Backend: `npm install` ✓
- [ ] Backend: `.env` configurado ✓
- [ ] Backend: `prisma generate` ✓
- [ ] Backend: `prisma migrate dev` ✓
- [ ] Backend: `npm run dev` ✓
- [ ] Backend respondendo em http://localhost:3333 ✓
- [ ] Criou tenant via `/api/auth/register` ✓
- [ ] Criou categorias e produtos ✓
- [ ] Testou endpoints com Postman/curl ✓

---

## 🎯 **ESTÁ PRONTO!**

Agora você tem:
- ✅ Backend API funcionando
- ✅ Banco multi-tenant configurado
- ✅ Documentação completa
- ⏳ Frontend para reorganizar

**Próximo passo?** Me avise quando quiser que eu reorganize o frontend! 🚀
