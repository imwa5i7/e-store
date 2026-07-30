import { Injectable } from '@nestjs/common';
import { Prisma, ProductVariant } from '@prisma/client';
import { PrismaService } from '@/database';
import {
  IVariantsRepository,
  VariantWithOptionValues,
} from './variants.repository.interface';

const variantInclude = {
  optionValues: { include: { optionValue: { include: { option: true } } } },
} satisfies Prisma.ProductVariantInclude;

@Injectable()
export class VariantsRepository implements IVariantsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: Prisma.ProductVariantCreateInput,
  ): Promise<VariantWithOptionValues> {
    return this.prisma.$transaction(async (tx) => {
      if (data.isDefault === true)
        await tx.productVariant.updateMany({
          where: { productId: data.product.connect!.id },
          data: { isDefault: false },
        });
      return tx.productVariant.create({ data, include: variantInclude });
    });
  }
  findAllByProduct(productId: number): Promise<VariantWithOptionValues[]> {
    return this.prisma.productVariant.findMany({
      where: { productId },
      include: variantInclude,
      orderBy: { createdAt: 'asc' },
    });
  }
  findById(id: number): Promise<VariantWithOptionValues | null> {
    return this.prisma.productVariant.findUnique({
      where: { id },
      include: variantInclude,
    });
  }
  findBySku(sku: string): Promise<ProductVariant | null> {
    return this.prisma.productVariant.findUnique({ where: { sku } });
  }
  async update(
    id: number,
    data: Prisma.ProductVariantUpdateInput,
  ): Promise<VariantWithOptionValues> {
    return this.prisma.$transaction(async (tx) => {
      if (data.isDefault === true) {
        const current = await tx.productVariant.findUniqueOrThrow({
          where: { id },
        });
        await tx.productVariant.updateMany({
          where: { productId: current.productId, id: { not: id } },
          data: { isDefault: false },
        });
      }
      return tx.productVariant.update({
        where: { id },
        data,
        include: variantInclude,
      });
    });
  }
  delete(id: number): Promise<ProductVariant> {
    return this.prisma.productVariant.delete({ where: { id } });
  }
  countByProduct(productId: number): Promise<number> {
    return this.prisma.productVariant.count({ where: { productId } });
  }
  findOptionValuesByIds(
    ids: number[],
  ): Promise<
    { id: number; optionId: number; option: { productId: number } }[]
  > {
    return this.prisma.productOptionValue.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        optionId: true,
        option: { select: { productId: true } },
      },
    });
  }
}
