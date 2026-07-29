import { Prisma, ProductImage } from '@prisma/client';

export interface IProductImagesRepository {
  create(data: Prisma.ProductImageCreateInput): Promise<ProductImage>;

  findById(id: number): Promise<ProductImage | null>;

  findByProductId(productId: number): Promise<ProductImage[]>;

  update(
    id: number,
    data: Prisma.ProductImageUpdateInput,
  ): Promise<ProductImage>;

  delete(id: number): Promise<ProductImage>;

  clearPrimary(productId: number): Promise<Prisma.BatchPayload>;

  setPrimary(imageId: number): Promise<ProductImage>;
}
