const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando build de produção...');

try {
  // 1. Build do frontend
  console.log('📦 Building frontend...');
  execSync('cd frontend && npm run build', { stdio: 'inherit' });

  // 2. Build do backend
  console.log('📦 Building backend...');
  execSync('cd backend && npm run build', { stdio: 'inherit' });

  // 3. Copiar frontend build para backend
  console.log('📁 Copiando frontend para backend...');
  const frontendDist = path.join(__dirname, 'frontend', 'dist');
  const backendDist = path.join(__dirname, 'backend', 'dist', 'frontend');
  
  if (fs.existsSync(backendDist)) {
    fs.rmSync(backendDist, { recursive: true, force: true });
  }
  
  execSync(`cp -r "${frontendDist}" "${backendDist}"`, { stdio: 'inherit' });

  console.log('✅ Build concluído! Execute "npm start" para rodar em produção.');
  
} catch (error) {
  console.error('❌ Erro durante o build:', error.message);
  process.exit(1);
}