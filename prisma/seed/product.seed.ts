import { PrismaClient, ProductStatus } from '@prisma/client';

export async function seedProducts(prisma: PrismaClient) {
  console.log('🌱 Seeding products...');

  const category = await prisma.category.findFirst();
  const brand = await prisma.brand.findFirst();

  if (!category) {
    throw new Error('No category found. Please seed categories first.');
  }

  if (!brand) {
    throw new Error('No brand found. Please seed brands first.');
  }

  await prisma.product.createMany({
    data: [
      {
        name: 'Logitech MX Master 3S',
        slug: 'logitech-mx-master-3s',
        description: 'Premium wireless productivity mouse.',
        sku: 'LOG-MX3S',
        status: ProductStatus.ACTIVE,
        isFeatured: true,
        categoryId: category.id,
        brandId: brand.id,
      },
      {
        name: 'Keychron K8 Pro',
        slug: 'keychron-k8-pro',
        description: 'Wireless mechanical keyboard.',
        sku: 'KEY-K8P',
        status: ProductStatus.ACTIVE,
        isFeatured: true,
        categoryId: category.id,
        brandId: brand.id,
      },
      {
        name: 'Sony WH-1000XM5',
        slug: 'sony-wh-1000xm5',
        description: 'Industry-leading noise cancelling headphones.',
        sku: 'SONY-XM5',
        status: ProductStatus.ACTIVE,
        isFeatured: false,
        categoryId: category.id,
        brandId: brand.id,
      },
      {
        name: 'Apple Magic Keyboard',
        slug: 'apple-magic-keyboard',
        description: 'Wireless keyboard with rechargeable battery.',
        sku: 'APL-MK',
        status: ProductStatus.DRAFT,
        isFeatured: false,
        categoryId: category.id,
        brandId: brand.id,
      },
      {
        name: 'Anker USB-C Hub',
        slug: 'anker-usb-c-hub',
        description: '7-in-1 USB-C hub with HDMI and Ethernet.',
        sku: 'ANK-HUB7',
        status: ProductStatus.ACTIVE,
        isFeatured: true,
        categoryId: category.id,
        brandId: brand.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Products seeded successfully.');
}
