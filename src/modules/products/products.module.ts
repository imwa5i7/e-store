import { Module } from '@nestjs/common';

import { BrandsModule } from '@/modules/brands';
import { CategoriesModule } from '@/modules/catergories';

import { ProductsController } from './controllers/products.controller';
import { ProductImagesController } from './controllers/product-images.controller';

import { ProductsService } from './services/products.service';
import { ProductImagesService } from './services/product-images.service';

import { ProductRepository } from './repositories/products.repository';
import { ProductImagesRepository } from './repositories/product-images.repository';

import {
  PRODUCT_REPOSITORY,
  PRODUCT_IMAGES_REPOSITORY,
} from './product.constants';

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
