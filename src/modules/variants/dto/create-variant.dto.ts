import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateVariantDto {
  @ApiProperty({
    example: 'IPH16-BLK-128',
    description: 'Unique sellable-item SKU',
  })
  @IsString()
  @IsNotEmpty()
  sku!: string;

  @ApiProperty({
    example: ['clx-option-black', 'clx-option-128gb'],
    description: 'Option value IDs assigned to this variant',
  })
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  optionValueIds!: number[];

  @ApiPropertyOptional({
    default: false,
    description: 'Whether this is the product default variant',
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isDefault?: boolean;

  @ApiPropertyOptional({
    default: true,
    description: 'Whether this variant is available for sale',
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;
}
