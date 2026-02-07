import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('🔧 Criando tenant e usuário admin...');

    // Verificar se já existe
    const existingUser = await prisma.user.findFirst({
      where: { email: 'admin@geminiburger.com' }
    });

    if (existingUser) {
      console.log('✅ Usuário admin já existe!');
      console.log('📧 Email: admin@geminiburger.com');
      console.log('🔑 Senha: admin123');
      return;
    }

    // Criar plano básico se não existir
    let plan = await prisma.plan.findFirst({
      where: { name: 'Basic' }
    });

    if (!plan) {
      plan = await prisma.plan.create({
        data: {
          name: 'Basic',
          price: 99,
          maxProducts: 50,
          maxOrders: 500,
          features: ['ai_suggestions', 'whatsapp_integration'],
        },
      });
    }

    // Criar tenant
    const tenant = await prisma.tenant.create({
      data: {
        slug: 'gemini-burger',
        businessName: 'Gemini Burger',
        email: 'admin@geminiburger.com',
        phone: '(11) 99999-9999',
        whatsappNumber: '5511999999999',
        city: 'São Paulo',
        state: 'SP',
        planId: plan.id,
        status: 'TRIAL',
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        schedule: {
          monday: { open: '18:00', close: '23:00' },
          tuesday: { open: '18:00', close: '23:00' },
          wednesday: { open: '18:00', close: '23:00' },
          thursday: { open: '18:00', close: '23:00' },
          friday: { open: '18:00', close: '23:30' },
          saturday: { open: '18:00', close: '23:30' },
          sunday: { open: '18:00', close: '22:00' },
        },
      },
    });

    // Criar usuário admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const user = await prisma.user.create({
      data: {
        name: 'Administrador',
        email: 'admin@geminiburger.com',
        password: hashedPassword,
        role: 'OWNER',
        tenantId: tenant.id,
      },
    });

    console.log('✅ Tenant e usuário criados com sucesso!');
    console.log('');
    console.log('📋 Informações de Login:');
    console.log('========================');
    console.log('📧 Email: admin@geminiburger.com');
    console.log('🔑 Senha: admin123');
    console.log('========================');
    console.log('');
    console.log('🌐 Acesse: http://localhost:3000');
    console.log('⚙️  Clique no ícone de engrenagem para fazer login');

  } catch (error) {
    console.error('❌ Erro ao criar admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
