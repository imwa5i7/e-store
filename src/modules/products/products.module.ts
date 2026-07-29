import { Module } from '@nestjs/common';

import { BrandsModule } from '@/modules/brands';
import { CategoriesModule } from '@/modules/catergories';
import {
  ProductsController,
  ProductsService,
  PRODUCT_REPOSITORY,
  ProductRepository,
  PRODUCT_IMAGES_REPOSITORY,
  ProductImagesRepository,
} from '@/modules/products';
import { ProductImagesController } from './controllers/product-images.controller';
import { ProductImagesService } from './services/product-images.service';

@Module({
  imports: [BrandsModule, CategoriesModule],
  providers: [
    ProductsService,
    ProductImagesService,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductRepository,
    },
    {
      provide: PRODUCT_IMAGES_REPOSITORY,
      useClass: ProductImagesRepository,
    },
  ],
  controllers: [ProductsController, ProductImagesController],
})
export class ProductsModule {}
