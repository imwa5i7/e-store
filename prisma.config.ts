import dotenv from 'dotenv';
import { defineConfig } from 'prisma/config';

dotenv.config({
  path: '.env.development',
});

export default defineConfig({
  schema: 'prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
