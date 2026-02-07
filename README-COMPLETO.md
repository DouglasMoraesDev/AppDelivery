# 🍔 Gemini Burger - Sistema de Pedidos com IA

Sistema completo de pedidos online para hamburgueria com integração de IA (Google Gemini), pagamento PIX e envio via WhatsApp.

![Status](https://img.shields.io/badge/status-beta-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green)

---

## 🚀 **Funcionalidades**

### **Cliente (Frontend)**
✅ Cardápio interativo com categorias  
✅ Carrinho de compras  
✅ Recomendações por IA (Google Gemini)  
✅ Busca de endereço por CEP  
✅ QR Code PIX para pagamento  
✅ Envio via WhatsApp  
✅ Design responsivo  

### **Administrativo**
✅ Sistema multi-tenant  
✅ Autenticação JWT  
✅ Gestão de pedidos  
✅ Rate limiting  
✅ Painel administrativo  

---

## 📋 **Instalação Rápida**

### **1. Clone e instale**
```bash
git clone https://github.com/seu-usuario/gemini-burger.git
cd gemini-burger
```

### **2. Com Docker (Recomendado)**
```bash
docker-compose up -d --build
```

Acesse:
- Frontend: http://localhost:5173
- Backend: http://localhost:3333

### **3. Sem Docker**

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Configure o .env
npx prisma generate
npx prisma migrate deploy
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
# Configure .env.local
npm run dev
```

---

## 🔑 **Configuração**

### **Backend (.env)**
```env
DATABASE_URL="mysql://root:senha@localhost:3306/gemini_burger"
JWT_SECRET="gere-com: node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\""
PORT=3333
```

### **Frontend (.env.local)**
```env
VITE_GEMINI_API_KEY=sua-chave-aqui
```

**Obter chave Gemini:** https://ai.google.dev/

---

## 🔒 **Segurança (IMPORTANTE)**

⚠️ Antes de produção, leia [SECURITY.md](SECURITY.md)

**Checklist mínimo:**
- [ ] JWT_SECRET forte
- [ ] HTTPS configurado
- [ ] Senhas fortes no BD
- [ ] CORS restrito
- [ ] Backups automáticos

---

## 📊 **Estrutura**

```
gemini-burger/
├── backend/           # API Node.js + Prisma
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   └── routes/
│   └── prisma/
├── frontend/          # React + TypeScript
│   ├── src/
│   │   ├── components/
│   │   │   └── AdminPanel.tsx
│   │   ├── services/
│   │   └── App.tsx
│   └── public/
└── docker-compose.yml
```

---

## 🐛 **Troubleshooting**

**Port já em uso:**
```bash
lsof -ti:5173 | xargs kill -9
```

**MySQL não conecta:**
```bash
docker ps  # Verificar se está rodando
```

**Prisma erro:**
```bash
cd backend && npx prisma generate
```

---

## 🚀 **Deploy**

Ver guia completo em [DEPLOY.md](DEPLOY.md)

**Opções:**
- Vercel (Frontend) + Railway (Backend)
- DigitalOcean VPS + Docker
- AWS/Azure

---

## 📄 **API Endpoints**

```
POST   /api/auth/login
GET    /api/produtos
POST   /api/pedidos
GET    /api/pedidos
PATCH  /api/pedidos/:id
```

---

## 🎯 **Roadmap**

**v1.0 (Atual)**
- [x] Pedidos online
- [x] Integração IA
- [x] PIX

**v1.1 (Próximo)**
- [ ] Painel admin completo
- [ ] Notificações real-time
- [ ] App mobile

---

## 📞 **Suporte**

- 📧 Email: suporte@geminiburger.com
- 🐛 Issues: [GitHub]

---

## 📄 **Licença**

MIT License

---

**⭐ Se ajudou você, dê uma estrela!**
