import { ApiProperty } from '@nestjs/swagger';
import { Category } from '@prisma/client';

export class CategoryResponseDto {
  @ApiProperty({
    example: 1,
  })
  id: number;

  @ApiProperty({
    example: 'Keyboards',
  })
  name: string;

  @ApiProperty({
    example: 'keyboards',
  })
  slug: string;

  @ApiProperty({
    example: 'Mechanical and membrane keyboards.',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    example: 'https://example.com/images/keyboards.png',
    nullable: true,
  })
  imageUrl: string | null;

  @ApiProperty({
    example: 1,
  })
  sortOrder: number;

  @ApiProperty({
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    example: 1,
    nullable: true,
  })
  parentId: number | null;

  @ApiProperty({
    example: '2026-07-28T09:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-07-28T09:30:00.000Z',
  })
  updatedAt: Date;

  constructor(category: Category) {
    this.id = category.id;
    this.name = category.name;
    this.slug = category.slug;
    this.description = category.description;
    this.imageUrl = category.imageUrl;
    this.sortOrder = category.sortOrder;
    this.isActive = category.isActive;
    this.parentId = category.parentId;
    this.createdAt = category.createdAt;
    this.updatedAt = category.updatedAt;
  }
}
