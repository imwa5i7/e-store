import { Module } from '@nestjs/common';
import { ProductsModule } from '@/modules/products';
import { ProductOptionsController } from './controllers/product-options.controller';
import { PRODUCT_OPTIONS_REPOSITORY } from './product-options.constants';
import { ProductOptionsRepository } from './repositories/product-options.repository';
import { ProductOptionsService } from './services/product-options.service';
@Module({
  imports: [ProductsModule],
  controllers: [ProductOptionsController],
  providers: [
    ProductOptionsService,
    { provide: PRODUCT_OPTIONS_REPOSITORY, useClass: ProductOptionsRepository },
  ],
  exports: [ProductOptionsService],
})
export class ProductOptionsModule {}
