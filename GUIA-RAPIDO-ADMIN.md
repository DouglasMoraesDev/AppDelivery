# 🚀 Guia Rápido - Área Administrativa

## 📋 Instalação em 3 Passos

### 1️⃣ Instalar Dependências do Backend
```bash
cd backend
npm install multer @types/multer
```

### 2️⃣ Atualizar Banco de Dados
```bash
npx prisma generate
npx prisma migrate dev --name add-admin-config-fields
```

### 3️⃣ Iniciar Aplicação
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 🔐 Primeiro Acesso

1. Abra `http://localhost:5173`
2. Clique no ícone de **engrenagem** (⚙️) no canto inferior esquerdo
3. Faça login com suas credenciais de admin

## 🎯 Funcionalidades Principais

### 📊 Visão Geral
- Veja estatísticas em tempo real
- Total de pedidos e faturamento
- Pedidos pendentes
- Total de produtos cadastrados

### 🍔 Gerenciar Produtos

#### Criar Produto
1. Clique em **"Novo Produto"**
2. Faça upload da imagem
3. Preencha nome, descrição e preço
4. Selecione a categoria
5. Adicione calorias e estoque (opcional)
6. Clique em **"Criar Produto"**

#### Editar Produto
1. Clique no ícone de **lápis** (✏️) no produto
2. Faça as alterações necessárias
3. Clique em **"Atualizar Produto"**

#### Ativar/Desativar Produto
- Clique no ícone de **olho** (👁️) no produto
- Verde = disponível | Vermelho = indisponível

#### Excluir Produto
- Clique no ícone de **lixeira** (🗑️)
- Confirme a exclusão

### ⚙️ Configurações

#### Informações Básicas
```
✏️ Nome do Estabelecimento
📞 Telefone
💬 WhatsApp
🟢/🔴 Status (Aberto/Fechado)
```

#### 🎨 Personalizar Cores
Clique nos seletores de cor para personalizar:
- 🟠 Cor Primária (laranja padrão)
- ⚫ Cor Secundária (preto padrão)
- 🟧 Cor de Destaque
- ⚪ Cor do Texto
- ⬛ Cor de Fundo

#### 🖼️ Logo e Banner
1. Clique em **"Carregar Logo"** ou **"Carregar Banner"**
2. Selecione a imagem (max 5MB)
3. Veja o preview
4. Clique em **"Salvar Configurações"**

#### 📍 Endereço
Preencha todos os campos:
```
CEP: _____-___
Rua: _______________
Número: _____
Bairro: _______________
Cidade: _______________
Estado: __
```

### 💾 Salvar Alterações
Sempre clique em **"Salvar Configurações"** após fazer mudanças!

## 🎨 Dicas de Personalização

### Cores Recomendadas

**Esquema Laranja (Atual)**
```
Primária:    #ea580c (laranja escuro)
Secundária:  #18181b (preto)
Destaque:    #f97316 (laranja)
Texto:       #ffffff (branco)
Fundo:       #0a0a0a (preto)
```

**Esquema Verde (Saudável)**
```
Primária:    #10b981 (verde)
Secundária:  #064e3b (verde escuro)
Destaque:    #34d399 (verde claro)
Texto:       #ffffff (branco)
Fundo:       #f0fdf4 (verde clarinho)
```

**Esquema Vermelho (Clássico)**
```
Primária:    #dc2626 (vermelho)
Secundária:  #1f2937 (cinza escuro)
Destaque:    #ef4444 (vermelho claro)
Texto:       #ffffff (branco)
Fundo:       #0f172a (azul escuro)
```

## 📸 Requisitos de Imagem

### Logo
- Formato: PNG ou JPG
- Tamanho recomendado: 200x200px
- Fundo transparente (PNG)
- Máximo: 5MB

### Banner
- Formato: PNG ou JPG
- Tamanho recomendado: 1200x400px
- Imagem horizontal
- Máximo: 5MB

### Produtos
- Formato: PNG, JPG ou WebP
- Tamanho recomendado: 800x600px
- Imagem do produto em destaque
- Fundo neutro ou transparente
- Máximo: 5MB

## 🔍 Solução de Problemas

### ❌ Erro ao fazer login
**Solução**: Verifique se você tem um usuário cadastrado no banco de dados

### ❌ Imagem não aparece
**Solução**: 
1. Verifique se a pasta `backend/uploads` existe
2. Recarregue a página

### ❌ Alterações não salvam
**Solução**:
1. Verifique a conexão com internet
2. Confirme que clicou em "Salvar Configurações"
3. Veja se o token de autenticação não expirou (faça login novamente)

### ❌ Erro 401
**Solução**: Seu token expirou, faça login novamente

### ❌ Backend não inicia
**Solução**: 
```bash
# Verifique se instalou o multer
cd backend
npm install multer @types/multer

# Verifique se rodou as migrations
npx prisma generate
npx prisma migrate dev
```

## 🎓 Vídeo Tutorial (Passo a Passo)

### 1. Personalizar Cores
1. Acesse **Configurações**
2. Role até **Cores e Identidade Visual**
3. Clique em cada cor para abrir o seletor
4. Escolha a cor desejada
5. Clique em **Salvar Configurações**

### 2. Adicionar Logo
1. Acesse **Configurações**
2. Role até **Cores e Identidade Visual**
3. Clique em **Carregar Logo**
4. Selecione sua imagem
5. Veja o preview
6. Clique em **Salvar Configurações**

### 3. Criar Produto
1. Acesse aba **Produtos**
2. Clique em **Novo Produto**
3. Clique em **Carregar Imagem**
4. Preencha: Nome, Descrição, Preço
5. Selecione a Categoria
6. Adicione Calorias (opcional)
7. Clique em **Criar Produto**

### 4. Editar Endereço
1. Acesse **Configurações**
2. Role até **Endereço**
3. Preencha todos os campos
4. Clique em **Salvar Configurações**

## 📱 Visualizar Alterações

Após salvar qualquer configuração:
1. Abra uma nova aba
2. Acesse `http://localhost:5173`
3. Veja suas alterações aplicadas!

## 🆘 Suporte

Encontrou algum problema? Consulte:
- `ADMIN-SETUP.md` - Documentação técnica
- `ADMIN-FEATURES.md` - Lista completa de funcionalidades

## ✨ Pronto!

Sua área administrativa está configurada e pronta para uso! 🎉

**Bom trabalho e boas vendas! 🍔🎯**
