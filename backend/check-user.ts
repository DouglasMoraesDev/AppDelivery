import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUser() {
  const user = await prisma.user.findFirst({
    where: { email: 'admin@geminiburger.com' },
    include: { tenant: true }
  });
  
  console.log('User:', JSON.stringify(user, null, 2));
  await prisma.$disconnect();
}

checkUser();
