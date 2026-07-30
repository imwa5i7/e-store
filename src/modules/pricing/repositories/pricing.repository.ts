import { Injectable } from '@nestjs/common';
import { Prisma, ProductPrice } from '@prisma/client';

import { PrismaService } from '@/database';

import { IPricingRepository } from './pricing.repository.interface';

@Injectable()
export class PricingRepository implements IPricingRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.ProductPriceUncheckedCreateInput): Promise<ProductPrice> {
    return this.prisma.productPrice.create({ data });
  }

  findById(id: number): Promise<ProductPrice | null> {
    return this.prisma.productPrice.findUnique({ where: { id } });
  }

  findByProductId(productId: number): Promise<ProductPrice | null> {
    return this.prisma.productPrice.findUnique({ where: { productId } });
  }

  update(
    id: number,
    data: Prisma.ProductPriceUncheckedUpdateInput,
  ): Promise<ProductPrice> {
    return this.prisma.productPrice.update({ where: { id }, data });
  }

  delete(id: number): Promise<ProductPrice> {
    return this.prisma.productPrice.delete({ where: { id } });
  }
}
