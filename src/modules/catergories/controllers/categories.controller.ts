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
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import {
  CategoryResponseDto,
  CategoryTreeResponseDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../dto';
import { CategoriesService } from '../services/categories.service';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new category',
  })
  @ApiCreatedResponse({
    type: CategoryResponseDto,
  })
  async create(@Body() dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    return this.categoriesService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all categories',
  })
  @ApiOkResponse({
    type: CategoryResponseDto,
    isArray: true,
  })
  async findAll(): Promise<CategoryResponseDto[]> {
    return this.categoriesService.findAll();
  }

  @Get('tree')
  @ApiOperation({
    summary: 'Get category tree',
  })
  @ApiOkResponse({
    type: CategoryTreeResponseDto,
    isArray: true,
  })
  async getTree(): Promise<CategoryTreeResponseDto[]> {
    return this.categoriesService.getTree();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get category by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
  })
  @ApiOkResponse({
    type: CategoryResponseDto,
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CategoryResponseDto> {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update category',
  })
  @ApiParam({
    name: 'id',
    type: Number,
  })
  @ApiOkResponse({
    type: CategoryResponseDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Soft delete category',
  })
  @ApiParam({
    name: 'id',
    type: Number,
  })
  @ApiOkResponse({
    description: 'Category deleted successfully.',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.categoriesService.remove(id);
  }

  @Patch(':id/restore')
  @ApiOperation({
    summary: 'Restore a deleted category',
  })
  @ApiParam({
    name: 'id',
    type: Number,
  })
  @ApiOkResponse({
    type: CategoryResponseDto,
  })
  async restore(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CategoryResponseDto> {
    return this.categoriesService.restore(id);
  }
}
