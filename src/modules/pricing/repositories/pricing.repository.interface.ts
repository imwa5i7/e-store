import { Prisma, ProductPrice } from '@prisma/client';

export interface IPricingRepository {
  create(data: Prisma.ProductPriceUncheckedCreateInput): Promise<ProductPrice>;

  findById(id: number): Promise<ProductPrice | null>;

  findByProductId(productId: number): Promise<ProductPrice | null>;

  update(
    id: number,
    data: Prisma.ProductPriceUncheckedUpdateInput,
  ): Promise<ProductPrice>;

  delete(id: number): Promise<ProductPrice>;
}
