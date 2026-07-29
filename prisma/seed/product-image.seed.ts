import { PrismaClient } from '@prisma/client';

export async function seedProductImages(prisma: PrismaClient) {
  console.log('🌱 Seeding product images...');

  const products = await prisma.product.findMany();

  if (!products.length) {
    throw new Error('Please seed products first.');
  }

  for (const product of products) {
    await prisma.productImage.createMany({
      data: [
        {
          productId: product.id,
          imageUrl: `https://picsum.photos/seed/${product.slug}-1/800/800`,
          altText: `${product.name} Front View`,
          isPrimary: true,
          sortOrder: 1,
        },
        {
          productId: product.id,
          imageUrl: `https://picsum.photos/seed/${product.slug}-2/800/800`,
          altText: `${product.name} Side View`,
          isPrimary: false,
          sortOrder: 2,
        },
        {
          productId: product.id,
          imageUrl: `https://picsum.photos/seed/${product.slug}-3/800/800`,
          altText: `${product.name} Back View`,
          isPrimary: false,
          sortOrder: 3,
        },
      ],
      skipDuplicates: true,
    });
  }

  console.log('✅ Product images seeded.');
}
