import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Brand } from '@prisma/client';

export class BrandResponseDto {
  @ApiProperty({
    example: 1,
    description: 'Unique brand identifier',
  })
  id: number;

  @ApiProperty({
    example: 'Logitech',
    description: 'Brand name',
  })
  name: string;

  @ApiProperty({
    example: 'logitech',
    description: 'URL friendly brand slug',
  })
  slug: string;

  @ApiPropertyOptional({
    example: 'Leading manufacturer of computer peripherals',
    description: 'Brand description',
  })
  description: string | null;

  @ApiPropertyOptional({
    example: 'https://example.com/logo.png',
    description: 'Brand logo URL',
  })
  logoUrl: string | null;

  @ApiPropertyOptional({
    example: 'https://www.logitech.com',
    description: 'Official website URL',
  })
  websiteUrl: string | null;

  @ApiProperty({
    example: true,
    description: 'Whether the brand is active',
  })
  isActive: boolean;

  @ApiProperty({
    example: '2026-07-28T12:00:00.000Z',
    description: 'Brand creation date',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-07-28T12:00:00.000Z',
    description: 'Brand last update date',
  })
  updatedAt: Date;

  constructor(brand: Brand) {
    this.id = brand.id;
    this.name = brand.name;
    this.slug = brand.slug;
    this.description = brand.description;
    this.logoUrl = brand.logoUrl;
    this.websiteUrl = brand.websiteUrl;
    this.isActive = brand.isActive;
    this.createdAt = brand.createdAt;
    this.updatedAt = brand.updatedAt;
  }
}
