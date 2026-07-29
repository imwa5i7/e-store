import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductImageDto {
  @ApiProperty({
    example: 'https://cdn.example.com/products/mouse-1.jpg',
    description: 'URL of the product image',
  })
  @IsUrl()
  imageUrl!: string;

  @ApiPropertyOptional({
    example: 'Front view of the wireless mouse',
    description: 'Alternative text for accessibility',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  altText?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Whether this image is the primary product image',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @ApiPropertyOptional({
    example: 0,
    description: 'Display order of the image',
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
