import { Inject, Injectable } from '@nestjs/common';
import { Prisma, ProductImage } from '@prisma/client';

import { PrismaService } from '../../../database/prisma.service';
import type { IProductImagesRepository } from '../repositories';
import { PRODUCT_IMAGES_REPOSITORY } from '../product.constants';

@Injectable()
export class ProductImagesRepository implements IProductImagesRepository {
  constructor(
    @Inject(PRODUCT_IMAGES_REPOSITORY)
    private readonly prisma: PrismaService,
  ) {}

  create(data: Prisma.ProductImageCreateInput): Promise<ProductImage> {
    return this.prisma.productImage.create({
      data,
    });
  }

  findById(id: number): Promise<ProductImage | null> {
    return this.prisma.productImage.findUnique({
      where: { id },
    });
  }

  findByProductId(productId: number): Promise<ProductImage[]> {
    return this.prisma.productImage.findMany({
      where: { productId },
      orderBy: {
        sortOrder: 'asc',
      },
    });
  }

  update(
    id: number,
    data: Prisma.ProductImageUpdateInput,
  ): Promise<ProductImage> {
    return this.prisma.productImage.update({
      where: { id },
      data,
    });
  }

  delete(id: number): Promise<ProductImage> {
    return this.prisma.productImage.delete({
      where: { id },
    });
  }

  clearPrimary(productId: number): Promise<Prisma.BatchPayload> {
    return this.prisma.productImage.updateMany({
      where: {
        productId,
        isPrimary: true,
      },
      data: {
        isPrimary: false,
      },
    });
  }

  setPrimary(imageId: number): Promise<ProductImage> {
    return this.prisma.productImage.update({
      where: { id: imageId },
      data: {
        isPrimary: true,
      },
    });
  }
}
