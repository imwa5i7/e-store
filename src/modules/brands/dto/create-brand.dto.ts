import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateBrandDto {
  @ApiProperty({
    example: 'Logitech',
    description: 'Brand name',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({
    example: 'Leading manufacturer of computer peripherals and accessories',
    description: 'Optional brand description',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/logitech-logo.png',
    description: 'URL of the brand logo image',
  })
  @IsUrl()
  @IsOptional()
  logoUrl?: string;

  @ApiPropertyOptional({
    example: 'https://www.logitech.com',
    description: 'Official brand website URL',
  })
  @IsUrl()
  @IsOptional()
  websiteUrl?: string;
}
