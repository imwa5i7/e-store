import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateProductOptionDto } from '../dto/create-product-option.dto';
import { CreateProductOptionValueDto } from '../dto/create-product-option-value.dto';
import { ProductOptionResponseDto } from '../dto/product-option-response.dto';
import { UpdateProductOptionDto } from '../dto/update-product-option.dto';
import { ProductOptionsService } from '../services/product-options.service';
@ApiTags('Product Options')
@Controller()
export class ProductOptionsController {
  constructor(private readonly productOptionsService: ProductOptionsService) {}
  @Post('products/:productId/options')
  @ApiOperation({ summary: 'Create a product option' })
  @ApiParam({ name: 'productId', type: Number })
  @ApiCreatedResponse({ type: ProductOptionResponseDto })
  @ApiConflictResponse({ description: 'Option name already exists.' })
  @ApiNotFoundResponse({ description: 'Product not found.' })
  create(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: CreateProductOptionDto,
  ): Promise<ProductOptionResponseDto> {
    return this.productOptionsService.createOption(productId, dto);
  }
  @Post('options/:optionId/values')
  @ApiOperation({ summary: 'Add a value to a product option' })
  @ApiCreatedResponse({ type: ProductOptionResponseDto })
  @ApiConflictResponse({ description: 'Option value already exists.' })
  @ApiNotFoundResponse({ description: 'Option not found.' })
  addValue(
    @Param('optionId', ParseIntPipe) optionId: number,
    @Body() dto: CreateProductOptionValueDto,
  ): Promise<ProductOptionResponseDto> {
    return this.productOptionsService.addOptionValue(optionId, dto);
  }
  @Get('products/:productId/options')
  @ApiOperation({ summary: 'List product options' })
  @ApiParam({ name: 'productId', type: Number })
  @ApiOkResponse({ type: ProductOptionResponseDto, isArray: true })
  @ApiNotFoundResponse({ description: 'Product not found.' })
  findAll(
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<ProductOptionResponseDto[]> {
    return this.productOptionsService.getOptions(productId);
  }
  @Patch('options/:id')
  @ApiOperation({ summary: 'Update a product option' })
  @ApiOkResponse({ type: ProductOptionResponseDto })
  @ApiConflictResponse({ description: 'Option name already exists.' })
  @ApiNotFoundResponse({ description: 'Option not found.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductOptionDto,
  ): Promise<ProductOptionResponseDto> {
    return this.productOptionsService.updateOption(id, dto);
  }
  @Delete('options/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a product option' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'Option not found.' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.productOptionsService.deleteOption(id);
  }
}
