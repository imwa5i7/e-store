import { Prisma, ProductOption } from '@prisma/client';
export type ProductOptionWithValues = Prisma.ProductOptionGetPayload<{
  include: { values: true };
}>;
export interface IProductOptionsRepository {
  create(
    data: Prisma.ProductOptionCreateInput,
  ): Promise<ProductOptionWithValues>;
  createValue(
    optionId: number,
    value: string,
  ): Promise<ProductOptionWithValues>;
  findAllByProduct(productId: number): Promise<ProductOptionWithValues[]>;
  findById(id: number): Promise<ProductOptionWithValues | null>;
  findByProductIdAndName(
    productId: number,
    name: string,
  ): Promise<ProductOption | null>;
  update(
    id: number,
    data: Prisma.ProductOptionUpdateInput,
  ): Promise<ProductOptionWithValues>;
  delete(id: number): Promise<ProductOption>;
}
