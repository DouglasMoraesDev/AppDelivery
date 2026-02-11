# Environment (development, production)
NODE_ENV=development

# Database
DATABASE_URL="mysql://root:Voyageturbo13@localhost:3306/burgueroficial"

# JWT - ATENÇÃO: Gere um secret forte em produção!
# Use: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET="Voyageturbo13"
JWT_EXPIRES_IN="7d"

# Server
PORT=4000
FRONTEND_URL="http://localhost:3000"

# CORS - Adicione domínios permitidos em produção
CORS_ORIGIN="http://localhost:3000"

# Rate Limiting (requisições por minuto)
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# Gemini AI (opcional - pode usar a key do tenant)
GEMINI_API_KEY="your-gemini-api-key"

# Email (para notificações - opcional)
EMAIL_HOST="smtp.example.com"
EMAIL_PORT=587
EMAIL_USER="your-email@example.com"
EMAIL_PASS="your-email-password"

# WhatsApp Business API (opcional)
WHATSAPP_API_URL=""
WHATSAPP_API_TOKEN=""

# Payment Gateway (adicione quando integrar)
MERCADOPAGO_ACCESS_TOKEN=""
STRIPE_SECRET_KEY=""



# Configuração do Frontend
VITE_API_URL="http://localhost:4000/api"
VITE_BACKEND_URL="http://localhost:4000"

# Gemini AI (opcional)
VITE_GEMINI_API_KEY="your-gemini-api-key-here"
