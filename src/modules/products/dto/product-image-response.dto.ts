import { ApiProperty } from '@nestjs/swagger';
import { ProductImage } from '@prisma/client';

export class ProductImageResponseDto {
  @ApiProperty({
    example: 1,
  })
  id: number;

  @ApiProperty({
    example: 1,
  })
  productId: number;

  @ApiProperty({
    example: 'https://cdn.example.com/products/mouse-1.jpg',
  })
  imageUrl: string;

  @ApiProperty({
    example: 'Front view of the wireless mouse',
    nullable: true,
  })
  altText: string | null;

  @ApiProperty({
    example: true,
  })
  isPrimary: boolean;

  @ApiProperty({
    example: 0,
  })
  sortOrder: number;

  @ApiProperty({
    example: '2026-07-29T12:00:00.000Z',
  })
  createdAt: Date;

  constructor(productImage: ProductImage) {
    this.id = productImage.id;
    this.productId = productImage.productId;
    this.imageUrl = productImage.imageUrl;
    this.altText = productImage.altText;
    this.isPrimary = productImage.isPrimary;
    this.sortOrder = productImage.sortOrder;
    this.createdAt = productImage.createdAt;
  }
}
