import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { Product } from '@prisma/client';

import { CreateProductDto, SearchProductsDto, UpdateProductDto } from '../dto';
import {
  PaginatedProductsResponse,
  ProductsService,
} from '../services/products.service';
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
    summary: 'Search, filter, sort, and paginate products',
  })
  @ApiOkResponse({
    description: 'Products fetched successfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid search filters or pagination values.',
  })
  async findAll(
    @Query() dto: SearchProductsDto,
  ): Promise<PaginatedProductsResponse> {
    return this.productService.search(dto);
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
