import { ApiProperty } from '@nestjs/swagger';

export class CategoryTreeResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  slug?: string;

  @ApiProperty({
    nullable: true,
  })
  description!: string | null;

  @ApiProperty({
    nullable: true,
  })
  imageUrl?: string | null;

  @ApiProperty()
  sortOrder!: number;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty({
    nullable: true,
  })
  parentId?: number | null;

  @ApiProperty({
    type: () => [CategoryTreeResponseDto],
  })
  children!: CategoryTreeResponseDto[];
}
