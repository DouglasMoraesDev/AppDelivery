# Backend - Configuração da Área Administrativa

Este documento descreve como configurar e usar a área administrativa do sistema.

## Estrutura Criada

### Backend

#### Modelos Atualizados (Prisma)
- Adicionadas novas colunas ao modelo `Tenant`:
  - `banner`: String opcional para imagem de banner
  - `accentColor`: Cor de destaque
  - `textColor`: Cor do texto
  - `bgColor`: Cor de fundo

#### Novos Controllers
- **ConfiguracaoController**: Gerencia configurações do tenant
  - `GET /api/config`: Retorna configurações atuais
  - `PUT /api/config`: Atualiza configurações
  - `POST /api/config/upload-image`: Upload de imagens (logo/banner)

#### Novos Middlewares
- **uploadMiddleware**: Gerencia upload de imagens usando multer
  - Limita tamanho a 5MB
  - Aceita apenas imagens (jpg, png, gif, webp)
  - Salva na pasta `backend/uploads/`

#### Novas Rotas
- `/api/config`: Rotas de configuração (requer autenticação)

### Frontend

#### Novos Componentes

1. **LoginAdmin**: Tela de login administrativo
   - Validação de credenciais
   - Armazenamento de token no localStorage
   - Recuperação de senha (interface)

2. **AdminDashboard**: Painel administrativo principal
   - **Aba Visão Geral**: 
     - Cards com estatísticas (pedidos, faturamento, produtos)
   - **Aba Produtos**:
     - Listagem de produtos com imagem
     - Edição e exclusão de produtos
     - Toggle de disponibilidade
     - Modal para criar/editar produtos
   - **Aba Configurações**:
     - Informações básicas (nome, telefone, WhatsApp)
     - Cores personalizáveis (5 cores)
     - Upload de logo e banner
     - Endereço completo
     - Status de funcionamento (aberto/fechado)

3. **ProductModal**: Modal para criar/editar produtos
   - Upload de imagem do produto
   - Nome, descrição, preço
   - Categoria
   - Calorias e estoque (opcionais)
   - Toggle de disponibilidade

4. **AppRouter**: Gerenciador de rotas
   - Alternância entre visão do cliente e admin
   - Botão flutuante para acessar área admin
   - Persistência de sessão admin

## Como Usar

### 1. Atualizar o Banco de Dados

Execute a migration do Prisma para criar as novas colunas:

\`\`\`bash
cd backend
npm run prisma:migrate
# ou
npx prisma migrate dev --name add-config-fields
\`\`\`

### 2. Instalar Dependências

Certifique-se de instalar o multer no backend:

\`\`\`bash
cd backend
npm install multer
npm install --save-dev @types/multer
\`\`\`

### 3. Acessar a Área Admin

Existem duas formas:

**Opção 1**: Clicar no botão de engrenagem no canto inferior esquerdo da tela do cliente

**Opção 2**: Acessar diretamente via URL: `http://localhost:5173/admin`

### 4. Fazer Login

Use as credenciais de um usuário cadastrado no sistema:
- Email: email cadastrado no banco
- Senha: senha do usuário

### 5. Gerenciar Configurações

No painel admin você pode:

#### Produtos
- Criar novos produtos com foto
- Editar produtos existentes
- Excluir produtos
- Ativar/desativar produtos
- Gerenciar estoque e calorias

#### Configurações
- Alterar nome do estabelecimento
- Atualizar telefone e WhatsApp
- Personalizar cores do tema
- Fazer upload de logo e banner
- Atualizar endereço completo
- Abrir/fechar estabelecimento

#### Visualização em Tempo Real
Todas as alterações são salvas no banco de dados e podem ser refletidas no frontend do cliente automaticamente.

## Estrutura de Arquivos

\`\`\`
backend/
  uploads/              # Pasta para imagens
  src/
    controllers/
      ConfiguracaoController.ts
    middlewares/
      uploadMiddleware.ts
    routes/
      configuracaoRotas.ts

frontend/
  src/
    components/
      LoginAdmin.tsx
      AdminDashboard.tsx
      ProductModal.tsx
    AppRouter.tsx
\`\`\`

## Próximos Passos

Para melhorias futuras, considere:

1. **Integração com CDN**: Usar serviço como Cloudinary ou AWS S3 para imagens
2. **Redimensionamento de Imagens**: Processar imagens no backend antes de salvar
3. **Validação de Permissões**: Adicionar roles diferentes (owner, admin, manager)
4. **Histórico de Alterações**: Log de mudanças nas configurações
5. **Preview em Tempo Real**: Mostrar preview das cores antes de salvar
6. **Temas Pré-definidos**: Oferecer paletas de cores prontas
7. **Backup de Configurações**: Exportar/importar configurações

## Segurança

- Todas as rotas admin requerem autenticação via JWT
- Upload de arquivos limitado a 5MB
- Apenas formatos de imagem permitidos
- Validação de tipos de arquivo no backend
- Proteção contra CSRF através de tokens

## Troubleshooting

**Problema**: Imagens não aparecem após upload
**Solução**: Verifique se a pasta `backend/uploads` existe e tem permissões de escrita

**Problema**: Erro 401 ao acessar configurações
**Solução**: Faça login novamente, o token pode ter expirado

**Problema**: Alterações não aparecem no frontend
**Solução**: Recarregue a página ou implemente um sistema de sincronização em tempo real com WebSockets
\`\`\`
