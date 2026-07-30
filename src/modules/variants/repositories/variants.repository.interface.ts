import { Prisma, ProductVariant } from '@prisma/client';

export type VariantWithOptionValues = Prisma.ProductVariantGetPayload<{
  include: {
    optionValues: { include: { optionValue: { include: { option: true } } } };
  };
}>;

export interface IVariantsRepository {
  create(
    data: Prisma.ProductVariantCreateInput,
  ): Promise<VariantWithOptionValues>;
  findAllByProduct(productId: number): Promise<VariantWithOptionValues[]>;
  findById(id: number): Promise<VariantWithOptionValues | null>;
  findBySku(sku: string): Promise<ProductVariant | null>;
  update(
    id: number,
    data: Prisma.ProductVariantUpdateInput,
  ): Promise<VariantWithOptionValues>;
  delete(id: number): Promise<ProductVariant>;
  countByProduct(productId: number): Promise<number>;
  findOptionValuesByIds(
    ids: number[],
  ): Promise<{ id: number; optionId: number; option: { productId: number } }[]>;
}
