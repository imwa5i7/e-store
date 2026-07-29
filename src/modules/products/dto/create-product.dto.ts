import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'MX Master 3S Mouse',
    description: 'Product name',
  })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiPropertyOptional({
    example: 'Wireless ergonomic mouse',
    description: 'Product description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'LOG-MX3S-BLK',
    description: 'Unique product SKU',
  })
  @IsString()
  sku!: string;

  @ApiProperty({
    example: 1,
    description: 'Category ID',
  })
  @IsInt()
  categoryId!: number;

  @ApiProperty({
    example: 1,
    description: 'Brand ID',
  })
  @IsInt()
  brandId!: number;
}
