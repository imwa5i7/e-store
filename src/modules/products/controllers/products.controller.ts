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
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { Product } from '@prisma/client';

import { CreateProductDto, UpdateProductDto } from '../dto';
import { ProductsService } from '@/modules/products';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create product',
  })
  @ApiCreatedResponse({
    description: 'Product created successfully',
  })
  async create(@Body() dto: CreateProductDto): Promise<Product> {
    return this.productService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List products',
  })
  @ApiOkResponse({
    description: 'Products fetched successfully',
  })
  async findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get product details',
  })
  @ApiOkResponse({
    description: 'Product fetched successfully',
  })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update product',
  })
  @ApiOkResponse({
    description: 'Product updated successfully',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Soft delete product',
  })
  @ApiOkResponse({
    description: 'Product deleted successfully',
  })
  async softDelete(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productService.softDelete(id);
  }
}
