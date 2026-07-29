import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Product, ProductImage, ProductStatus } from '@prisma/client';

import { ProductImageResponseDto } from './product-image-response.dto';

type ProductWithImages = Product & {
  images: ProductImage[];
};

export class ProductResponseDto {
  @ApiProperty({
    example: 1,
  })
  id: number;

  @ApiProperty({
    example: 'MX Master 3S Mouse',
  })
  name: string;

  @ApiProperty({
    example: 'mx-master-3s-mouse',
  })
  slug: string;

  @ApiPropertyOptional({
    example: 'Wireless ergonomic mouse',
  })
  description: string | null;

  @ApiProperty({
    example: 'LOG-MX3S-BLK',
  })
  sku: string;

  @ApiProperty({
    enum: ProductStatus,
    example: ProductStatus.ACTIVE,
  })
  status: ProductStatus;

  @ApiProperty({
    example: false,
  })
  isFeatured: boolean;

  @ApiProperty({
    example: 1,
  })
  categoryId: number;

  @ApiProperty({
    example: 1,
  })
  brandId: number;

  @ApiProperty({
    type: [ProductImageResponseDto],
    example: [],
  })
  images: ProductImageResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(product: ProductWithImages) {
    this.id = product.id;
    this.name = product.name;
    this.slug = product.slug;
    this.description = product.description;
    this.sku = product.sku;
    this.status = product.status;
    this.isFeatured = product.isFeatured;
    this.categoryId = product.categoryId;
    this.brandId = product.brandId;

    this.images = product.images.map(
      (image) => new ProductImageResponseDto(image),
    );

    this.createdAt = product.createdAt;
    this.updatedAt = product.updatedAt;
  }
}
