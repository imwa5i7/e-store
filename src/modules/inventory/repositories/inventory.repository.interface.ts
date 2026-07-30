import { Inventory } from '@prisma/client';

export interface InventoryRepositoryInterface {
  findByProductId(productId: number): Promise<Inventory | null>;

  create(productId: number): Promise<Inventory>;

  update(productId: number, data: Partial<Inventory>): Promise<Inventory>;

  increase(productId: number, quantity: number): Promise<Inventory>;

  decrease(productId: number, quantity: number): Promise<Inventory>;
}
