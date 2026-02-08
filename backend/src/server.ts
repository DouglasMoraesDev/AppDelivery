import express from 'express';
import cors from 'cors';
import path from 'path';
import 'express-async-errors';
import { config } from 'dotenv';
import { routes } from './routes';
import { tratadorErros } from './middlewares/tratadorErros';
import { generalLimiter } from './middlewares/rateLimiter';

config();

const app = express();
const PORT = process.env.PORT || 4000;

console.log(`🔧 Configuração: NODE_ENV=${process.env.NODE_ENV}, PORT=${PORT}`);

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Logging middleware para debug
app.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log(`\n📨 ${req.method} ${req.path}`);
    console.log(`📋 Content-Type: ${req.get('content-type')}`);
  }
  next();
});

// Rate limiting geral
app.use('/api', generalLimiter);

// Express middleware - tamanho padrão é ok já que não usamos mais base64
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(path.join(__dirname, '..', '..', 'public', 'uploads')));

// Routes
app.use('/api', routes);

// Servir arquivos estáticos do frontend (em produção)
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '..', 'public');
  
  // Verificar se a pasta existe
  if (require('fs').existsSync(frontendPath)) {
    // Servir arquivos estáticos
    app.use(express.static(frontendPath));
    
    // Catch all para SPA (Single Page Application) - deve vir depois das rotas da API
    app.get('*', (req, res) => {
      // Não capturar rotas da API
      if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
        return res.status(404).json({ error: 'Route not found' });
      }
      res.sendFile(path.join(frontendPath, 'index.html'));
    });
  } else {
    console.log('⚠️ Frontend build não encontrado. Execute o build primeiro.');
  }
}

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    port: PORT 
  });
});

// Logging middleware para debug
app.use('/api', (req, res, next) => {
  console.log(`📝 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Error handler
app.use(tratadorErros);

const server = app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  
  // Testar conexão com banco
  try {
    const { prisma } = await import('./lib/prisma');
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
});

server.on('error', (error: any) => {
  console.error('❌ Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  }
  process.exit(1);
});
