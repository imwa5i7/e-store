import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateProductImageDto } from '../dto/create-product-image.dto';
import { ProductImageResponseDto } from '../dto/product-image-response.dto';
import { UpdateProductImageDto } from '../dto/update-product-image.dto';
import { ProductImagesService } from '../services/product-images.service';

@ApiTags('Product Images')
@Controller('products')
export class ProductImagesController {
  constructor(private readonly productImagesService: ProductImagesService) {}

  @Post(':id/images')
  @ApiOperation({ summary: 'Add image to a product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 201,
    type: ProductImageResponseDto,
  })
  create(
    @Param('id', ParseIntPipe) productId: number,
    @Body() dto: CreateProductImageDto,
  ): Promise<ProductImageResponseDto> {
    return this.productImagesService.create(productId, dto);
  }

  @Get(':id/images')
  @ApiOperation({ summary: 'Get product images' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    type: ProductImageResponseDto,
    isArray: true,
  })
  findAll(
    @Param('id', ParseIntPipe) productId: number,
  ): Promise<ProductImageResponseDto[]> {
    return this.productImagesService.findAll(productId);
  }

  @Patch('images/:imageId')
  @ApiOperation({ summary: 'Update product image' })
  @ApiParam({ name: 'imageId', description: 'Image ID' })
  @ApiResponse({
    status: 200,
    type: ProductImageResponseDto,
  })
  update(
    @Param('imageId', ParseIntPipe) imageId: number,
    @Body() dto: UpdateProductImageDto,
  ): Promise<ProductImageResponseDto> {
    return this.productImagesService.update(imageId, dto);
  }

  @Delete('images/:imageId')
  @ApiOperation({ summary: 'Delete product image' })
  @ApiParam({ name: 'imageId', description: 'Image ID' })
  @ApiResponse({
    status: 204,
  })
  async remove(@Param('imageId', ParseIntPipe) imageId: number): Promise<void> {
    await this.productImagesService.remove(imageId);
  }

  @Patch('images/:imageId/primary')
  @ApiOperation({ summary: 'Set product primary image' })
  @ApiParam({ name: 'imageId', description: 'Image ID' })
  @ApiResponse({
    status: 200,
    type: ProductImageResponseDto,
  })
  setPrimary(
    @Param('imageId', ParseIntPipe) imageId: number,
  ): Promise<ProductImageResponseDto> {
    return this.productImagesService.setPrimary(imageId);
  }
}
