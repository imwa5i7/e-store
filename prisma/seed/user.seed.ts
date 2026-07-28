import { faker } from '@faker-js/faker';
import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export async function seedUsers(prisma: PrismaClient): Promise<void> {
  console.log('🌱 Seeding users...');

  await prisma.user.deleteMany();

  const password = await bcrypt.hash('Password123!', 10);

  const users = Array.from({ length: 20 }, (_, index) => ({
    email: faker.internet.email().toLowerCase(),
    password,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    phone: faker.helpers.maybe(() => faker.phone.number(), {
      probability: 0.7,
    }),
    role: index === 0 ? UserRole.ADMIN : UserRole.CUSTOMER,
    isActive: faker.datatype.boolean(),
    isEmailVerified: faker.datatype.boolean(),
  }));

  await prisma.user.createMany({
    data: users,
  });

  console.log(`✅ Seeded ${users.length} users.`);
}
