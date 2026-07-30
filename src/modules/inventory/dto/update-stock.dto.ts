import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateStockDto {
  @ApiPropertyOptional({
    example: 50,
    description: 'Set current inventory quantity',
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  quantity?: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Stock level at which warning is triggered',
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  lowStockThreshold?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Enable or disable inventory tracking',
  })
  @IsOptional()
  @IsBoolean()
  trackInventory?: boolean;

  @ApiPropertyOptional({
    example: false,
    description: 'Allow selling products without stock',
  })
  @IsOptional()
  @IsBoolean()
  allowBackorder?: boolean;
}
