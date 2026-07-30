import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';

import { InventoryRepositoryInterface } from './inventory.repository.interface';

@Injectable()
export class PrismaInventoryRepository implements InventoryRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  findByProductId(productId: number) {
    return this.prisma.inventory.findUnique({
      where: {
        productId,
      },
    });
  }

  create(productId: number) {
    return this.prisma.inventory.create({
      data: {
        productId,
      },
    });
  }

  update(productId: number, data: Partial<any>) {
    return this.prisma.inventory.update({
      where: {
        productId,
      },

      data,
    });
  }

  increase(productId: number, quantity: number) {
    return this.prisma.inventory.update({
      where: {
        productId,
      },

      data: {
        quantity: {
          increment: quantity,
        },
      },
    });
  }

  decrease(productId: number, quantity: number) {
    return this.prisma.inventory.update({
      where: {
        productId,
      },

      data: {
        quantity: {
          decrement: quantity,
        },
      },
    });
  }
}
