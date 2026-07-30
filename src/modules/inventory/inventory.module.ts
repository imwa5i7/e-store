import { Module } from '@nestjs/common';

import { InventoryController } from './controllers/inventory.controller';

import { InventoryService } from './services/inventory.service';

import { PrismaInventoryRepository } from './repositories/inventory.repository';
import { INVENTORY_REPO_INTERFACE } from './inventory.constants';

@Module({
  controllers: [InventoryController],

  providers: [
    InventoryService,

    {
      provide: INVENTORY_REPO_INTERFACE,
      useClass: PrismaInventoryRepository,
    },
  ],

  exports: [InventoryService],
})
export class InventoryModule {}
//TODO: Do later
//InventoryTransaction
