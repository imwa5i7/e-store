import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';

import type { InventoryRepositoryInterface } from '../repositories/inventory.repository.interface';

import { UpdateStockDto } from '../dto/update-stock.dto';
import { INVENTORY_REPO_INTERFACE } from '../inventory.constants';
import { Inventory } from '@prisma/client';

@Injectable()
export class InventoryService {
  constructor(
    @Inject(INVENTORY_REPO_INTERFACE)
    private readonly inventoryRepository: InventoryRepositoryInterface,
  ) {}

  async getInventory(productId: number) {
    let inventory = await this.inventoryRepository.findByProductId(productId);

    if (!inventory) {
      inventory = await this.inventoryRepository.create(productId);
    }

    return this.mapInventoryResponse(inventory);
  }

  async updateInventory(productId: number, dto: UpdateStockDto) {
    const inventory = await this.inventoryRepository.findByProductId(productId);

    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    const updatedInventory = await this.inventoryRepository.update(
      productId,
      dto,
    );
    return this.mapInventoryResponse(updatedInventory);
  }

  async increaseStock(productId: number, quantity: number) {
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than zero');
    }

    const updatedInventory = await this.inventoryRepository.increase(
      productId,
      quantity,
    );
    return this.mapInventoryResponse(updatedInventory);
  }

  async decreaseStock(productId: number, quantity: number) {
    const inventory = await this.inventoryRepository.findByProductId(productId);

    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    if (inventory.quantity < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    const updatedInventory = await this.inventoryRepository.decrease(
      productId,
      quantity,
    );
    return this.mapInventoryResponse(updatedInventory);
  }

  private mapInventoryResponse(inventory: Inventory) {
    return {
      ...inventory,

      availableQuantity: inventory.quantity - inventory.reservedQuantity,
    };
  }
}
