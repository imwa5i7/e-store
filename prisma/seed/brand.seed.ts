import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';

const brands = [
  {
    name: 'Apple',
    description:
      'Technology company known for smartphones, computers, and accessories.',
    logoUrl: 'https://logo.clearbit.com/apple.com',
    websiteUrl: 'https://www.apple.com',
  },
  {
    name: 'Samsung',
    description:
      'Electronics company producing smartphones, displays, and accessories.',
    logoUrl: 'https://logo.clearbit.com/samsung.com',
    websiteUrl: 'https://www.samsung.com',
  },
  {
    name: 'Logitech',
    description: 'Manufacturer of computer peripherals and gaming accessories.',
    logoUrl: 'https://logo.clearbit.com/logitech.com',
    websiteUrl: 'https://www.logitech.com',
  },
  {
    name: 'Anker',
    description:
      'Consumer electronics brand specializing in charging products.',
    logoUrl: 'https://logo.clearbit.com/anker.com',
    websiteUrl: 'https://www.anker.com',
  },
];

export async function seedBrands(prisma: PrismaClient): Promise<void> {
  console.log('🌱 Seeding brands...');

  for (const brand of brands) {
    const slug = slugify(brand.name, {
      lower: true,
      strict: true,
      trim: true,
    });

    await prisma.brand.upsert({
      where: {
        slug,
      },
      update: {},
      create: {
        ...brand,
        slug,
      },
    });
  }

  console.log('✅ Brands seeded successfully.');
}
