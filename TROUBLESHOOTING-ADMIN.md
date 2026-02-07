# 🔧 Solucionando Problemas - Área Admin

## ❌ Página Não Carrega

Se a página administrativa não estiver carregando, siga estes passos:

---

## 1️⃣ VERIFICAR SE OS SERVIDORES ESTÃO RODANDO

### Backend
```bash
cd backend
npm run dev
```

**Deve exibir:**
```
🚀 Server running on http://localhost:3333
📊 Environment: development
```

### Frontend
```bash
cd frontend
npm run dev
```

**Deve exibir:**
```
VITE v... ready in ...ms

➜  Local:   http://localhost:5173/
➜  Network: ...
```

---

## 2️⃣ VERIFICAR ERROS NO CONSOLE

### Abrir Console do Navegador
```
Chrome/Edge: F12 ou Ctrl+Shift+I
Firefox: F12
Safari: Cmd+Option+I (Mac)
```

### Erros Comuns e Soluções

#### ❌ Erro: "Cannot GET /api/..."
**Problema:** Backend não está rodando ou porta errada

**Solução:**
```bash
cd backend
npm run dev
```

#### ❌ Erro: "Network Error" ou "Failed to fetch"
**Problema:** CORS ou backend não acessível

**Solução 1 - Verificar .env do backend:**
```env
# backend/.env
FRONTEND_URL=http://localhost:5173
PORT=3333
DATABASE_URL="mysql://user:password@localhost:3306/database"
JWT_SECRET=seu-secret-aqui
```

**Solução 2 - Limpar cache:**
```bash
cd frontend
rm -rf node_modules/.vite
npm run dev
```

#### ❌ Erro: "401 Unauthorized"
**Problema:** Token expirado ou inválido

**Solução:**
1. Abra o DevTools (F12)
2. Vá em Application/Storage
3. Limpe localStorage
4. Faça login novamente

#### ❌ Erro: "Cannot find module..."
**Problema:** Dependências não instaladas

**Solução:**
```bash
# Backend
cd backend
npm install
npm install multer @types/multer

# Frontend
cd frontend
npm install
```

---

## 3️⃣ VERIFICAR BANCO DE DADOS

### Testar Conexão
```bash
cd backend
npx prisma studio
```

Se abrir uma interface web → Banco está OK ✅

Se der erro → Verificar DATABASE_URL no .env

### Aplicar Migrations
```bash
cd backend
npx prisma generate
npx prisma migrate dev
```

---

## 4️⃣ PROBLEMAS ESPECÍFICOS

### 📱 Tela Branca ao Acessar Admin

**Possíveis Causas:**
1. JavaScript desabilitado
2. Erro de compilação
3. Rota incorreta

**Soluções:**
```bash
# 1. Verificar se há erros no console (F12)
# 2. Limpar cache do navegador
# 3. Tentar em modo anônimo
# 4. Reiniciar servidor frontend

cd frontend
# Parar o servidor (Ctrl+C)
npm run dev
```

### 🔐 Não Consigo Fazer Login

**Problema 1:** Usuário não existe

**Solução:** Criar usuário no banco ou via API:
```bash
# Via Prisma Studio
npx prisma studio

# Ou verificar se há registro via frontend público
```

**Problema 2:** Senha incorreta

**Solução:** 
- Verificar se está usando a senha correta
- Se necessário, resetar via banco de dados

**Problema 3:** Token não salva

**Solução:**
1. Verificar localStorage
2. Limpar cookies
3. Tentar outro navegador

### 📊 Pedidos Não Aparecem

**Causa:** Nenhum pedido foi criado ainda

**Solução:** 
1. Criar pedidos via frontend do cliente
2. Ou criar pedidos de teste via Prisma Studio

**Para testar:**
```bash
cd backend
npx prisma studio
# Criar registros manualmente nas tabelas:
# - customers
# - orders
# - order_items
```

### 🖼️ Imagens Não Carregam

**Problema:** Pasta uploads não existe ou sem permissão

**Solução:**
```bash
cd backend
mkdir uploads
chmod 755 uploads  # Linux/Mac
```

**Windows:**
```powershell
cd backend
New-Item -ItemType Directory -Path uploads
```

---

## 5️⃣ RESETAR TUDO (ÚLTIMA OPÇÃO)

Se nada funcionar, reset completo:

```bash
# 1. Parar todos os servidores (Ctrl+C)

# 2. Limpar Backend
cd backend
rm -rf node_modules
rm -rf uploads
npm install
npm install multer @types/multer
npx prisma generate
npx prisma migrate dev

# 3. Limpar Frontend
cd ../frontend
rm -rf node_modules
rm -rf dist
rm -rf node_modules/.vite
npm install

# 4. Iniciar novamente
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

---

## 6️⃣ VERIFICAR PORTAS

### Porta 3333 em Uso
```bash
# Windows
netstat -ano | findstr :3333
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3333 | xargs kill -9
```

### Porta 5173 em Uso
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5173 | xargs kill -9
```

---

## 7️⃣ MODO DEBUG

### Backend com Logs
```bash
cd backend
# Adicionar console.log em server.ts ou controllers
npm run dev
```

### Frontend com Logs
Adicionar no código:
```typescript
console.log('Estado atual:', { config, products, orders });
```

---

## 8️⃣ CHECKLIST COMPLETO

Antes de reportar problema, verificar:

- [ ] Backend está rodando na porta 3333
- [ ] Frontend está rodando na porta 5173
- [ ] Banco de dados está acessível
- [ ] Migrations foram aplicadas
- [ ] Dependências estão instaladas (incluindo multer)
- [ ] Arquivo .env existe e está configurado
- [ ] Console do navegador não mostra erros
- [ ] localStorage não está bloqueado
- [ ] Pasta uploads existe
- [ ] Usuário admin existe no banco

---

## 9️⃣ AMBIENTES ESPECÍFICOS

### Windows

**PowerShell Execution Policy:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Node Version:**
```bash
node --version  # Mínimo: v16+
npm --version   # Mínimo: v8+
```

### Linux/Mac

**Permissões:**
```bash
sudo chown -R $USER:$USER .
chmod -R 755 backend/uploads
```

---

## 🆘 AINDA COM PROBLEMAS?

### Informações para Reportar

Se ainda não funcionar, reúna estas informações:

```bash
# 1. Versões
node --version
npm --version

# 2. Sistema Operacional
# Windows/Linux/Mac + versão

# 3. Console Errors
# Copie TODOS os erros do console (F12)

# 4. Terminal Output
# Copie a saída do backend E frontend

# 5. Arquivo .env (SEM SENHAS)
# Mostre as variáveis (oculte valores sensíveis)
```

### Passos para Debug:

1. **Abra o Console** (F12)
2. **Vá na aba Network**
3. **Tente fazer login**
4. **Veja qual requisição falhou**
5. **Clique nela e veja:**
   - Request Headers
   - Response
   - Status Code

### Erros Mais Comuns:

| Erro | Causa | Solução |
|------|-------|---------|
| 401 | Token inválido | Fazer login novamente |
| 404 | Rota não encontrada | Verificar rotas no backend |
| 500 | Erro no servidor | Ver logs do terminal backend |
| CORS | Backend não permite origem | Configurar CORS no server.ts |
| Timeout | Servidor não responde | Verificar se backend está rodando |

---

## ✅ RESOLUÇÃO RÁPIDA

**90% dos problemas são resolvidos com:**

```bash
# 1. Reinstalar dependências
cd backend && npm install && cd ../frontend && npm install

# 2. Aplicar migrations
cd backend && npx prisma generate && npx prisma migrate dev

# 3. Limpar cache
cd frontend && rm -rf node_modules/.vite

# 4. Reiniciar TUDO
# Parar todos os processos (Ctrl+C)
# Iniciar backend: cd backend && npm run dev
# Iniciar frontend: cd frontend && npm run dev
```

---

## 📝 LOGS ÚTEIS

### Ver Requisições
Adicione no AdminDashboard.tsx:
```typescript
const loadOrders = async () => {
  console.log('🔄 Carregando pedidos...');
  try {
    const token = localStorage.getItem('adminToken');
    console.log('🔑 Token:', token ? 'Existe' : 'Não existe');
    
    const response = await fetch('/api/orders', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    console.log('📡 Status:', response.status);
    const data = await response.json();
    console.log('📦 Dados:', data);
    
    setOrders(data);
  } catch (error) {
    console.error('❌ Erro:', error);
  }
};
```

---

**🎯 Com estes passos, você conseguirá identificar e resolver qualquer problema!**
