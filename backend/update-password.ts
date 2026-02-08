import bcrypt from 'bcryptjs';
import { prisma } from './src/lib/prisma.js';

(async () => {
  const newPassword = 'admin123';
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Primeiro, encontrar o usuário
  const user = await prisma.user.findFirst({
    where: {
      email: 'admin@geminiburger.com'
    }
  });

  if (!user) {
    console.log('❌ Usuário não encontrado');
    process.exit(1);
  }

  const updated = await prisma.user.update({
    where: {
      tenantId_email: {
        tenantId: user.tenantId,
        email: 'admin@geminiburger.com'
      }
    },
    data: {
      password: hashedPassword
    }
  });

  console.log('✅ Senha atualizada para admin@geminiburger.com');
  console.log('Nova senha: admin123');

  process.exit(0);
})();
