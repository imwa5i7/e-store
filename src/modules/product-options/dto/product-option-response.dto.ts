import { ApiProperty } from '@nestjs/swagger';
export class ProductOptionValueResponseDto {
  @ApiProperty({ example: 1 }) id!: number;
  @ApiProperty({ example: 'Black' }) value!: string;
  @ApiProperty() createdAt!: Date;
  @ApiProperty() updatedAt!: Date;
}
export class ProductOptionResponseDto {
  @ApiProperty({ example: 1 }) id!: number;
  @ApiProperty({ example: 1 }) productId!: number;
  @ApiProperty({ example: 'Color' }) name!: string;
  @ApiProperty({ type: [ProductOptionValueResponseDto] })
  values!: ProductOptionValueResponseDto[];
  @ApiProperty() createdAt!: Date;
  @ApiProperty() updatedAt!: Date;
}
