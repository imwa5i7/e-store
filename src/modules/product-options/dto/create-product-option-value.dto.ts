import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class CreateProductOptionValueDto {
  @ApiProperty({ example: 'Black' }) @IsString() @IsNotEmpty() value!: string;
}
