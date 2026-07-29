import { Module } from '@nestjs/common';
import { PrismaModule } from '@/database';
import { BrandsController } from './controllers/brands.controller';
import { BrandsService } from './services/brands.service';
import { BRAND_REPOSITORY } from './brands.constants';
import { BrandRepository } from './repositories';

@Module({
  imports: [PrismaModule],
  controllers: [BrandsController],
  providers: [
    BrandsService,
    BrandRepository,
    {
      provide: BRAND_REPOSITORY,
      useExisting: BrandRepository,
    },
  ],
  exports: [BrandsService],
})
export class BrandsModule {}
