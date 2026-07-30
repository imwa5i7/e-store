import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ProductPriceEntity } from '../entity/product-price.entity';

export class PriceResponseDto extends ProductPriceEntity {
  @ApiProperty({ example: 'cmc123...' })
  declare id: number;

  @ApiProperty({ example: 1 })
  declare productId: number;

  @ApiProperty({ example: '12000.00' })
  declare regularPrice: string;

  @ApiPropertyOptional({ example: '9999.00', nullable: true })
  declare salePrice: string | null;

  @ApiProperty({ example: 'PKR' })
  declare currency: string;

  @ApiPropertyOptional({ example: '2026-08-01T00:00:00.000Z', nullable: true })
  declare saleStartsAt: Date | null;

  @ApiPropertyOptional({ example: '2026-08-31T23:59:59.999Z', nullable: true })
  declare saleEndsAt: Date | null;

  @ApiProperty({ example: '2026-07-30T10:00:00.000Z' })
  declare createdAt: Date;

  @ApiProperty({ example: '2026-07-30T10:00:00.000Z' })
  declare updatedAt: Date;
}
