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
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { BrandsService } from '../services/brands.service';
import { BrandResponseDto } from '../dto/brand-response.dto';
import { CreateBrandDto } from '../dto/create-brand.dto';
import { UpdateBrandDto } from '../dto/update-brand.dto';

@ApiTags('Brands')
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new brand' })
  @ApiCreatedResponse({
    type: BrandResponseDto,
    description: 'Brand created successfully.',
  })
  create(@Body() createBrandDto: CreateBrandDto): Promise<BrandResponseDto> {
    return this.brandsService.create(createBrandDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all brands' })
  @ApiOkResponse({
    type: BrandResponseDto,
    isArray: true,
  })
  findAll(): Promise<BrandResponseDto[]> {
    return this.brandsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a brand by ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Brand ID',
  })
  @ApiOkResponse({
    type: BrandResponseDto,
  })
  findById(@Param('id', ParseIntPipe) id: number): Promise<BrandResponseDto> {
    return this.brandsService.findById(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get a brand by slug' })
  @ApiParam({
    name: 'slug',
    description: 'Brand slug',
  })
  @ApiOkResponse({
    type: BrandResponseDto,
  })
  findBySlug(@Param('slug') slug: string): Promise<BrandResponseDto> {
    return this.brandsService.findBySlug(slug);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a brand' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Brand ID',
  })
  @ApiOkResponse({
    type: BrandResponseDto,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBrandDto: UpdateBrandDto,
  ): Promise<BrandResponseDto> {
    return this.brandsService.update(id, updateBrandDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a brand' })
  @ApiNoContentResponse({
    description: 'Brand deleted successfully.',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.brandsService.remove(id);
  }
}
