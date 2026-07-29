import { Module } from '@nestjs/common';

import { CategoriesController } from './controllers/categories.controller';
import { CategoriesRepository } from './repositories/categories.repository';
import { CategoriesService } from './services/categories.service';
import { CATEGORIES_REPOSITORY } from './categories.constants';

@Module({
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    CategoriesRepository,
    {
      provide: CATEGORIES_REPOSITORY,
      useClass: CategoriesRepository,
    },
  ],
  exports: [CategoriesService],
})
export class CategoriesModule {}
