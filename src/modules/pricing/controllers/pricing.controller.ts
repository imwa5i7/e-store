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
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { CreatePriceDto } from '../dto/create-price.dto';
import { PriceResponseDto } from '../dto/price-response.dto';
import { UpdatePriceDto } from '../dto/update-price.dto';
import { PricingService } from '../services/pricing.service';

@ApiTags('Pricing')
@Controller()
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Post('pricing')
  @ApiOperation({ summary: 'Create product pricing' })
  @ApiCreatedResponse({
    type: PriceResponseDto,
    description: 'Pricing created successfully.',
  })
  @ApiBadRequestResponse({ description: 'Invalid pricing values.' })
  @ApiConflictResponse({
    description: 'Pricing already exists for the product.',
  })
  @ApiNotFoundResponse({ description: 'Product not found.' })
  create(@Body() dto: CreatePriceDto): Promise<PriceResponseDto> {
    return this.pricingService.create(dto);
  }

  @Get('products/:productId/pricing')
  @ApiOperation({ summary: 'Get product pricing' })
  @ApiParam({ name: 'productId', type: Number, description: 'Product ID' })
  @ApiOkResponse({
    type: PriceResponseDto,
    description: 'Pricing retrieved successfully.',
  })
  @ApiNotFoundResponse({ description: 'Pricing not found.' })
  findByProduct(
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<PriceResponseDto> {
    return this.pricingService.findByProduct(productId);
  }

  @Patch('pricing/:id')
  @ApiOperation({ summary: 'Update product pricing' })
  @ApiParam({ name: 'id', type: String, description: 'Pricing ID' })
  @ApiOkResponse({
    type: PriceResponseDto,
    description: 'Pricing updated successfully.',
  })
  @ApiBadRequestResponse({ description: 'Invalid pricing values.' })
  @ApiConflictResponse({ description: 'Target product already has pricing.' })
  @ApiNotFoundResponse({ description: 'Pricing or target product not found.' })
  update(
    @Param('id') id: number,
    @Body() dto: UpdatePriceDto,
  ): Promise<PriceResponseDto> {
    return this.pricingService.update(id, dto);
  }

  @Delete('pricing/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete product pricing' })
  @ApiParam({ name: 'id', type: String, description: 'Pricing ID' })
  @ApiNoContentResponse({ description: 'Pricing deleted successfully.' })
  @ApiNotFoundResponse({ description: 'Pricing not found.' })
  async remove(@Param('id') id: number): Promise<void> {
    await this.pricingService.remove(id);
  }
}
