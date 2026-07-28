import dotenv from 'dotenv';

dotenv.config({
  path: '.env.development',
});

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

import { seedCategories, seedUsers } from '../seed';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
});

async function main(): Promise<void> {
  console.log('🚀 Starting database seed...');

  // Delete in dependency order
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  await seedUsers(prisma);
  await seedCategories(prisma);

  console.log('🎉 Database seeded successfully.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
