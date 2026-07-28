import { PrismaClient } from '@prisma/client';

export async function seedCategories(prisma: PrismaClient): Promise<void> {
  console.log('🌱 Seeding categories...');

  await prisma.category.deleteMany();

  const peripherals = await prisma.category.create({
    data: {
      name: 'Peripherals',
      slug: 'peripherals',
      description: 'Computer peripherals',
      sortOrder: 1,
    },
  });

  const components = await prisma.category.create({
    data: {
      name: 'Components',
      slug: 'components',
      description: 'Computer components',
      sortOrder: 2,
    },
  });

  await prisma.category.createMany({
    data: [
      {
        name: 'Keyboards',
        slug: 'keyboards',
        parentId: peripherals.id,
        sortOrder: 1,
      },
      {
        name: 'Mice',
        slug: 'mice',
        parentId: peripherals.id,
        sortOrder: 2,
      },
      {
        name: 'Headsets',
        slug: 'headsets',
        parentId: peripherals.id,
        sortOrder: 3,
      },
      {
        name: 'Monitors',
        slug: 'monitors',
        parentId: peripherals.id,
        sortOrder: 4,
      },
      {
        name: 'Processors',
        slug: 'processors',
        parentId: components.id,
        sortOrder: 1,
      },
      {
        name: 'Motherboards',
        slug: 'motherboards',
        parentId: components.id,
        sortOrder: 2,
      },
      {
        name: 'Graphics Cards',
        slug: 'graphics-cards',
        parentId: components.id,
        sortOrder: 3,
      },
      {
        name: 'Memory',
        slug: 'memory',
        parentId: components.id,
        sortOrder: 4,
      },
      {
        name: 'Storage',
        slug: 'storage',
        parentId: components.id,
        sortOrder: 5,
      },
    ],
  });

  console.log('✅ Categories seeded.');
}
