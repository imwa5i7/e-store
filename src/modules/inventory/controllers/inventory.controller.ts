import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { InventoryService } from '../services/inventory.service';
import { UpdateStockDto } from '../dto/update-stock.dto';
import { AdjustStockDto } from '../dto/adjust-stock.dto';
import { InventoryResponseDto } from '../dto/inventory-response.dto';

@ApiTags('Inventory')
@Controller('products/:productId/inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @ApiOperation({
    summary: 'Get product inventory',
    description: 'Retrieves the inventory information for a product.',
  })
  @ApiParam({
    name: 'productId',
    type: Number,
    description: 'Product ID',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Inventory retrieved successfully.',
    type: InventoryResponseDto,
  })
  async getInventory(
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<InventoryResponseDto> {
    return this.inventoryService.getInventory(productId);
  }

  @Patch()
  @ApiOperation({
    summary: 'Update inventory settings',
    description:
      'Updates inventory configuration such as low stock threshold, inventory tracking, and backorder settings.',
  })
  @ApiParam({
    name: 'productId',
    type: Number,
    description: 'Product ID',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Inventory updated successfully.',
    type: InventoryResponseDto,
  })
  async updateInventory(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: UpdateStockDto,
  ): Promise<InventoryResponseDto> {
    return this.inventoryService.updateInventory(productId, dto);
  }

  @Post('increase')
  @ApiOperation({
    summary: 'Increase stock',
    description: 'Adds stock to the product inventory.',
  })
  @ApiParam({
    name: 'productId',
    type: Number,
    description: 'Product ID',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Stock increased successfully.',
    type: InventoryResponseDto,
  })
  async increaseStock(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: AdjustStockDto,
  ): Promise<InventoryResponseDto> {
    return this.inventoryService.increaseStock(productId, dto.quantity);
  }

  @Post('decrease')
  @ApiOperation({
    summary: 'Decrease stock',
    description: 'Removes stock from the product inventory.',
  })
  @ApiParam({
    name: 'productId',
    type: Number,
    description: 'Product ID',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Stock decreased successfully.',
    type: InventoryResponseDto,
  })
  async decreaseStock(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: AdjustStockDto,
  ): Promise<InventoryResponseDto> {
    return this.inventoryService.decreaseStock(productId, dto.quantity);
  }
}
