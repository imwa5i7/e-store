import { Module } from '@nestjs/common';

import { BrandsModule } from '@/modules/brands';
import { CategoriesModule } from '@/modules/catergories';
import {
  ProductsController,
  ProductsService,
  PRODUCT_REPOSITORY,
  ProductRepository,
} from '@/modules/products';

@Module({
  imports: [BrandsModule, CategoriesModule],
  providers: [
    ProductsService,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductRepository,
    },
  ],
  controllers: [ProductsController],
})
export class ProductsModule {}
