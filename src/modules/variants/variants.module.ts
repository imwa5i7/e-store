import { Module } from '@nestjs/common';
import { ProductsModule } from '@/modules/products';
import { VariantsController } from './controllers/variants.controller';
import { VARIANTS_REPOSITORY } from './variants.constants';
import { VariantsRepository } from './repositories/variants.repository';
import { VariantsService } from './services/variants.service';
@Module({
  imports: [ProductsModule],
  controllers: [VariantsController],
  providers: [
    VariantsService,
    { provide: VARIANTS_REPOSITORY, useClass: VariantsRepository },
  ],
  exports: [VariantsService],
})
export class VariantsModule {}
