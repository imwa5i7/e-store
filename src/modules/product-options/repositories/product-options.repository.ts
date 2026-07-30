import { Injectable } from '@nestjs/common';
import { Prisma, ProductOption } from '@prisma/client';
import { PrismaService } from '@/database';
import {
  IProductOptionsRepository,
  ProductOptionWithValues,
} from './product-options.repository.interface';
const optionInclude = {
  values: { orderBy: { createdAt: 'asc' } },
} satisfies Prisma.ProductOptionInclude;
@Injectable()
export class ProductOptionsRepository implements IProductOptionsRepository {
  constructor(private readonly prisma: PrismaService) {}
  create(
    data: Prisma.ProductOptionCreateInput,
  ): Promise<ProductOptionWithValues> {
    return this.prisma.productOption.create({ data, include: optionInclude });
  }
  createValue(
    optionId: number,
    value: string,
  ): Promise<ProductOptionWithValues> {
    return this.prisma.productOption.update({
      where: { id: optionId },
      data: { values: { create: { value } } },
      include: optionInclude,
    });
  }
  findAllByProduct(productId: number): Promise<ProductOptionWithValues[]> {
    return this.prisma.productOption.findMany({
      where: { productId },
      include: optionInclude,
      orderBy: { createdAt: 'asc' },
    });
  }
  findById(id: number): Promise<ProductOptionWithValues | null> {
    return this.prisma.productOption.findUnique({
      where: { id },
      include: optionInclude,
    });
  }
  findByProductIdAndName(
    productId: number,
    name: string,
  ): Promise<ProductOption | null> {
    return this.prisma.productOption.findUnique({
      where: { productId_name: { productId, name } },
    });
  }
  update(
    id: number,
    data: Prisma.ProductOptionUpdateInput,
  ): Promise<ProductOptionWithValues> {
    return this.prisma.productOption.update({
      where: { id },
      data,
      include: optionInclude,
    });
  }
  delete(id: number): Promise<ProductOption> {
    return this.prisma.productOption.delete({ where: { id } });
  }
}
