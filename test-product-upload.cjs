const fs = require('fs');
const path = require('path');

// Função para fazer requisição POST com multipart/form-data usando Node.js nativo
async function testProductUpload() {
  try {
    // Passo 1: Fazer login
    console.log('🔐 Fazendo login...');
    const loginResponse = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@geminiburger.com',
        password: '123456'
      })
    });

    if (!loginResponse.ok) {
      throw new Error(`Login falhou: ${loginResponse.status}`);
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Login bem-sucedido');
    console.log('🔑 Token:', token.substring(0, 20) + '...');

    // Passo 2: Criar FormData com um produto teste
    console.log('\n📸 Preparando produto...');
    
    // Usar FormData nativo do Node.js (versão 18+)
    const formData = new FormData();
    formData.append('name', 'Produto Teste');
    formData.append('description', 'Descrição do produto de teste');
    formData.append('price', '29.99');
    formData.append('categoryId', '036be285-0452-4775-b582-d685c269bdb2'); // UUID da categoria teste
    formData.append('available', 'true');
    formData.append('stock', '100');
    formData.append('calories', '500');
    
    // Criar uma imagem de teste simples (1x1 pixel PNG)
    const pngBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
      0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
      0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41,
      0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
      0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00,
      0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,
      0x42, 0x60, 0x82
    ]);

    const blob = new Blob([pngBuffer], { type: 'image/png' });
    formData.append('image', blob, 'test-image.png');

    console.log('📦 FormData preparado');

    // Passo 3: Enviar requisição POST para criar produto
    console.log('\n📤 Enviando produto para /api/products...');
    
    const createResponse = await fetch('http://localhost:4000/api/products', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    console.log(`📊 Status da resposta: ${createResponse.status}`);
    
    const responseData = await createResponse.json();
    console.log('📋 Resposta:', JSON.stringify(responseData, null, 2));

    if (createResponse.ok) {
      console.log('✅ Produto criado com sucesso!');
    } else {
      console.log('❌ Erro ao criar produto');
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

testProductUpload();
