import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';

config();

async function testConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Testando conexão com banco de dados...');
    console.log(`🔗 Database URL: ${process.env.DATABASE_URL}`);
    
    await prisma.$connect();
    console.log('✅ Conexão com banco estabelecida com sucesso!');
    
    // Testar se consegue fazer uma query simples
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Query de teste executada:', result);
    
  } catch (error) {
    console.error('❌ Erro na conexão com banco:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();