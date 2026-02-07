import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedProducts() {
  try {
    // Buscar o tenant criado
    const tenant = await prisma.tenant.findFirst({
      where: { slug: 'gemini-burger' }
    });

    if (!tenant) {
      console.log('❌ Tenant não encontrado!');
      return;
    }

    console.log(`✅ Tenant encontrado: ${tenant.businessName}`);

    // Criar categorias
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { 
          tenantId_slug: { 
            tenantId: tenant.id, 
            slug: 'burgers' 
          } 
        },
        create: {
          name: 'Burgers',
          slug: 'burgers',
          tenantId: tenant.id,
        },
        update: {},
      }),
      prisma.category.upsert({
        where: { 
          tenantId_slug: { 
            tenantId: tenant.id, 
            slug: 'bebidas' 
          } 
        },
        create: {
          name: 'Bebidas',
          slug: 'bebidas',
          tenantId: tenant.id,
        },
        update: {},
      }),
      prisma.category.upsert({
        where: { 
          tenantId_slug: { 
            tenantId: tenant.id, 
            slug: 'porcoes' 
          } 
        },
        create: {
          name: 'Porções',
          slug: 'porcoes',
          tenantId: tenant.id,
        },
        update: {},
      }),
    ]);

    console.log(`✅ ${categories.length} categorias criadas/atualizadas`);

    // Criar produtos
    const products = [
      {
        name: 'X-Burger Clássico',
        slug: 'x-burger-classico',
        description: 'Hambúrguer de 180g, queijo, alface, tomate e molho especial',
        price: 25.90,
        categoryId: categories[0].id,
        available: true,
      },
      {
        name: 'X-Bacon',
        slug: 'x-bacon',
        description: 'Hambúrguer de 180g, bacon crocante, queijo, alface e molho barbecue',
        price: 29.90,
        categoryId: categories[0].id,
        available: true,
      },
      {
        name: 'X-Egg',
        slug: 'x-egg',
        description: 'Hambúrguer de 180g, ovo, queijo, presunto e molho especial',
        price: 27.90,
        categoryId: categories[0].id,
        available: true,
      },
      {
        name: 'X-Salada',
        slug: 'x-salada',
        description: 'Hambúrguer de 180g, queijo, alface, tomate, cebola e molho especial',
        price: 26.90,
        categoryId: categories[0].id,
        available: true,
      },
      {
        name: 'Coca-Cola 350ml',
        slug: 'coca-cola-350ml',
        description: 'Refrigerante Coca-Cola lata',
        price: 5.00,
        categoryId: categories[1].id,
        available: true,
      },
      {
        name: 'Suco Natural',
        slug: 'suco-natural',
        description: 'Suco natural de laranja, limão ou morango - 500ml',
        price: 8.00,
        categoryId: categories[1].id,
        available: true,
      },
      {
        name: 'Batata Frita',
        slug: 'batata-frita',
        description: 'Porção de batata frita crocante - 400g',
        price: 18.00,
        categoryId: categories[2].id,
        available: true,
      },
      {
        name: 'Onion Rings',
        slug: 'onion-rings',
        description: 'Porção de anéis de cebola empanados - 300g',
        price: 16.00,
        categoryId: categories[2].id,
        available: true,
      },
    ];

    let createdCount = 0;
    for (const productData of products) {
      const existing = await prisma.product.findFirst({
        where: {
          tenantId: tenant.id,
          name: productData.name,
        },
      });

      if (!existing) {
        await prisma.product.create({
          data: {
            ...productData,
            tenantId: tenant.id,
          },
        });
        createdCount++;
      }
    }

    console.log(`✅ ${createdCount} produtos criados!`);
    console.log('');
    console.log('📦 Produtos disponíveis para edição no admin!');
    console.log('🌐 Acesse: http://localhost:3000');
    console.log('👤 Login: admin@geminiburger.com / admin123');
    console.log('📋 Vá na aba "Produtos" para ver e editar');

  } catch (error) {
    console.error('❌ Erro ao criar produtos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedProducts();
