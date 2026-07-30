import { ApiProperty } from '@nestjs/swagger';

export class VariantOptionValueResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Black' })
  value!: string;

  @ApiProperty({ example: 'Color' })
  optionName!: string;
}

export class VariantResponseDto {
  @ApiProperty({ example: 3 })
  id!: number;
  @ApiProperty({ example: 1 })
  productId!: number;
  @ApiProperty({ example: 'IPH16-BLK-128' })
  sku!: string;
  @ApiProperty({ example: false })
  isDefault!: boolean;
  @ApiProperty({ example: true })
  isActive!: boolean;
  @ApiProperty({ type: [VariantOptionValueResponseDto] })
  optionValues!: VariantOptionValueResponseDto[];
  @ApiProperty() createdAt!: Date;
  @ApiProperty() updatedAt!: Date;
}
