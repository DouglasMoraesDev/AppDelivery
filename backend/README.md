# Backend - AppDelivery

## 🚀 Configuração Inicial

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
Copie o arquivo `.env.example` para `.env` e configure suas variáveis:
```bash
cp .env.example .env
```

**Importante:** Configure especialmente:
- `DATABASE_URL`: String de conexão com MySQL
- `JWT_SECRET`: Gere um segredo forte ([como gerar](#gerar-jwt-secret))
- `FRONTEND_URL`: URL do frontend (padrão: http://localhost:3000)

### 3. Configurar Banco de Dados

#### Aplicar Migrations
```bash
npx prisma migrate deploy
```

#### Gerar Client Prisma
```bash
npx prisma generate
```

#### (Opcional) Popular com Dados de Teste
```bash
npx tsx seed-products.ts
```

### 4. Iniciar Servidor
```bash
npm run dev
```

O servidor estará rodando em `http://localhost:4000`

## 🔧 Comandos Úteis

### Desenvolvimento
- `npm run dev` - Inicia servidor em modo desenvolvimento
- `npm run build` - Compila o projeto
- `npm start` - Inicia servidor em produção

### Prisma
- `npx prisma studio` - Abre interface visual do banco
- `npx prisma migrate dev` - Cria nova migration
- `npx prisma db push` - Sincroniza schema sem criar migration

### Utilitários
- `npx tsx create-admin.ts` - Cria usuário admin
- `npx tsx check-user.ts` - Verifica usuário
- `npx tsx update-password.ts` - Atualiza senha de usuário

## 📋 Gerar JWT Secret

Execute no terminal:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 📁 Estrutura

```
backend/
├── prisma/
│   ├── schema.prisma      # Schema do banco de dados
│   └── migrations/        # Histórico de migrations
├── src/
│   ├── server.ts         # Entrada da aplicação
│   ├── controllers/      # Lógica de negócio
│   ├── routes/          # Rotas da API
│   ├── middlewares/     # Middlewares Express
│   └── lib/            # Bibliotecas e configurações
├── .env.example        # Exemplo de variáveis de ambiente
└── package.json
```

## 🔐 Segurança

- Nunca commite o arquivo `.env`
- Use JWT secrets fortes em produção
- Configure CORS adequadamente
- Implemente rate limiting em produção

## 📦 Deploy

1. Configure as variáveis de ambiente no servidor
2. Execute as migrations: `npx prisma migrate deploy`
3. Compile o projeto: `npm run build`
4. Inicie a aplicação: `npm start`
