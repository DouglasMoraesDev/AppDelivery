# Instruções de Instalação - Área Administrativa

## Passo 1: Instalar Dependências Backend

cd backend
npm install multer
npm install --save-dev @types/multer

## Passo 2: Executar Migration do Prisma

# Gerar arquivos do Prisma
npx prisma generate

# Criar migration
npx prisma migrate dev --name add-admin-config-fields

## Passo 3: Executar Backend

npm run dev

## Passo 4: Executar Frontend (em outro terminal)

cd ../frontend
npm run dev

## Acessando a Área Admin

1. Abra http://localhost:5173
2. Clique no ícone de engrenagem no canto inferior esquerdo
3. Faça login com as credenciais de admin cadastradas

## Ou acesse diretamente:

http://localhost:5173/admin
