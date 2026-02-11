# 🔄 Setup em Novo PC/Ambiente

## ✅ PROBLEMA RESOLVIDO

Agora o projeto tem **migrations do Prisma** que garantem que o banco de dados seja criado idêntico em qualquer ambiente!

## 📋 Passo a Passo para Configurar em Outro PC

### 1. Clone o Repositório
```bash
git clone https://github.com/DouglasMoraesDev/AppDelivery.git
cd AppDelivery
```

### 2. Configure o Backend

#### a) Instale as dependências
```bash
cd backend
npm install
```

#### b) Configure as variáveis de ambiente
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o .env com suas configurações
notepad .env
```

**Configure especialmente:**
- `DATABASE_URL`: String de conexão com seu MySQL
  ```
  DATABASE_URL="mysql://usuario:senha@localhost:3306/nome_do_banco"
  ```
- `JWT_SECRET`: Use o mesmo ou gere um novo
- `FRONTEND_URL`: `http://localhost:3000`

#### c) Aplique as migrations (IMPORTANTE!)
```bash
# Isso criará todas as tabelas automaticamente
npx prisma migrate deploy

# Gere o Prisma Client
npx prisma generate
```

#### d) (Opcional) Popule com dados de teste
```bash
npx tsx seed-products.ts
```

#### e) Inicie o backend
```bash
npm run dev
```

### 3. Configure o Frontend

```bash
cd ../frontend
npm install
npm run dev
```

## 🎯 O que foi Corrigido

✅ **Migrations do Prisma** - O esquema do banco agora está versionado  
✅ **arquivo .env.example** - Template de configuração  
✅ **README.md** - Documentação completa de setup  

## ⚠️ IMPORTANTE

### ❌ NÃO commitar:
- `.env` (contém senhas e dados sensíveis)
- `node_modules/`
- `dist/`
- Arquivos `.db` ou `.sqlite`
- Pasta `uploads/` com imagens

### ✅ SEMPRE commitar:
- `prisma/migrations/` (histórico do banco)
- `.env.example` (template sem dados sensíveis)
- Código fonte
- `package.json` e `package-lock.json`

## 🚨 Problemas Comuns

### "Erro ao conectar no banco"
- Verifique se o MySQL está rodando
- Confirme as credenciais no `.env`
- Crie o banco de dados manualmente se necessário:
  ```sql
  CREATE DATABASE nome_do_banco;
  ```

### "Prisma Client não encontrado"
- Execute: `npx prisma generate`

### "Tabelas não existem"
- Execute: `npx prisma migrate deploy`

## 📞 Ajuda

Se encontrar problemas:
1. Verifique o arquivo `.env`
2. Confirme que rodou `npx prisma migrate deploy`
3. Veja os logs de erro no terminal
