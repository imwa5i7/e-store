import { Module } from '@nestjs/common';

import { ProductsModule } from '@/modules/products';

import { PricingController } from './controllers/pricing.controller';
import { PRICING_REPOSITORY } from './pricing.constants';
import { PricingRepository } from './repositories/pricing.repository';
import { PricingService } from './services/pricing.service';

@Module({
  imports: [ProductsModule],
  controllers: [PricingController],
  providers: [
    PricingService,
    {
      provide: PRICING_REPOSITORY,
      useClass: PricingRepository,
    },
  ],
  exports: [PricingService],
})
export class PricingModule {}
