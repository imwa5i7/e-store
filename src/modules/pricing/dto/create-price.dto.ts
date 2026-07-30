import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsDecimal,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

const toDecimalString = ({ value }: { value: unknown }): unknown =>
  typeof value === 'number' ? value.toString() : value;

const toDate = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' ? new Date(value) : value;

export class CreatePriceDto {
  @ApiProperty({ example: 1, description: 'Product ID' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  productId!: number;

  @ApiProperty({ example: '12000.00', description: 'Regular product price' })
  @Transform(toDecimalString)
  @IsDecimal({ decimal_digits: '1,2', force_decimal: false })
  regularPrice!: string;

  @ApiPropertyOptional({
    example: '9999.00',
    description: 'Optional sale price',
  })
  @IsOptional()
  @Transform(toDecimalString)
  @IsDecimal({ decimal_digits: '1,2', force_decimal: false })
  salePrice?: string;

  @ApiPropertyOptional({
    example: 'PKR',
    default: 'PKR',
    description: 'Price currency',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  currency?: string;

  @ApiPropertyOptional({
    example: '2026-08-01T00:00:00.000Z',
    description: 'Sale start time',
  })
  @IsOptional()
  @Transform(toDate)
  @IsDate()
  saleStartsAt?: Date;

  @ApiPropertyOptional({
    example: '2026-08-31T23:59:59.999Z',
    description: 'Sale end time',
  })
  @IsOptional()
  @Transform(toDate)
  @IsDate()
  saleEndsAt?: Date;
}
