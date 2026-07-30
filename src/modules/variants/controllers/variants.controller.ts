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
import { CreateVariantDto } from '../dto/create-variant.dto';
import { UpdateVariantDto } from '../dto/update-variant.dto';
import { VariantResponseDto } from '../dto/variant-response.dto';
import { VariantsService } from '../services/variants.service';

@ApiTags('Product Variants')
@Controller()
export class VariantsController {
  constructor(private readonly variantsService: VariantsService) {}
  @Post('products/:productId/variants')
  @ApiOperation({ summary: 'Create a product variant' })
  @ApiParam({ name: 'productId', type: Number })
  @ApiCreatedResponse({ type: VariantResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid option values.' })
  @ApiConflictResponse({ description: 'SKU already exists.' })
  @ApiNotFoundResponse({ description: 'Product not found.' })
  create(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: CreateVariantDto,
  ): Promise<VariantResponseDto> {
    return this.variantsService.createVariant(productId, dto);
  }
  @Get('products/:productId/variants')
  @ApiOperation({ summary: 'List product variants' })
  @ApiParam({ name: 'productId', type: Number })
  @ApiOkResponse({ type: VariantResponseDto, isArray: true })
  @ApiNotFoundResponse({ description: 'Product not found.' })
  findAll(
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<VariantResponseDto[]> {
    return this.variantsService.getVariants(productId);
  }
  @Get('variants/:id')
  @ApiOperation({ summary: 'Get a variant' })
  @ApiOkResponse({ type: VariantResponseDto })
  @ApiNotFoundResponse({ description: 'Variant not found.' })
  findOne(@Param('id') id: number): Promise<VariantResponseDto> {
    return this.variantsService.getVariant(id);
  }
  @Patch('variants/:id')
  @ApiOperation({ summary: 'Update a variant' })
  @ApiOkResponse({ type: VariantResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid option values.' })
  @ApiConflictResponse({ description: 'SKU already exists.' })
  @ApiNotFoundResponse({ description: 'Variant not found.' })
  update(
    @Param('id') id: number,
    @Body() dto: UpdateVariantDto,
  ): Promise<VariantResponseDto> {
    return this.variantsService.updateVariant(id, dto);
  }
  @Delete('variants/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a variant' })
  @ApiNoContentResponse()
  @ApiBadRequestResponse({
    description: 'The last product variant cannot be deleted.',
  })
  @ApiNotFoundResponse({ description: 'Variant not found.' })
  async remove(@Param('id') id: number): Promise<void> {
    await this.variantsService.deleteVariant(id);
  }
}
