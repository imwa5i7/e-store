import { IsInt, Min } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class AdjustStockDto {
  @ApiProperty({
    example: 10,
    description: 'Quantity to add or remove from inventory',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  quantity!: number;
}
