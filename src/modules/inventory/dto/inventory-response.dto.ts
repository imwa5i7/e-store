import { ApiProperty } from '@nestjs/swagger';

export class InventoryResponseDto {
  @ApiProperty({
    example: 123,
    description: 'Inventory ID',
  })
  id!: number;

  @ApiProperty({
    example: 11,
    description: 'Product ID',
  })
  productId!: number;

  @ApiProperty({
    example: 100,
    description: 'Current stock quantity',
  })
  quantity!: number;

  @ApiProperty({
    example: 10,
    description: 'Quantity reserved by pending orders',
  })
  reservedQuantity!: number;

  @ApiProperty({
    example: 90,
    description: 'Available quantity for purchase',
  })
  availableQuantity!: number;

  @ApiProperty({
    example: 5,
    description: 'Minimum stock level warning threshold',
  })
  lowStockThreshold!: number;

  @ApiProperty({
    example: true,
    description: 'Whether inventory tracking is enabled',
  })
  trackInventory!: boolean;

  @ApiProperty({
    example: false,
    description: 'Whether orders are allowed when stock is zero',
  })
  allowBackorder!: boolean;

  @ApiProperty({
    example: '2026-07-29T10:00:00.000Z',
  })
  createdAt!: Date;

  @ApiProperty({
    example: '2026-07-29T10:00:00.000Z',
  })
  updatedAt!: Date;
}
