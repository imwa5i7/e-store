import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { Product } from '@prisma/client';

import { BrandsService } from '@/modules/brands';
import { CategoriesService } from '@/modules/catergories';

import { CreateProductDto, SearchProductsDto, UpdateProductDto } from '../dto';
import { PRODUCT_REPOSITORY } from '../product.constants';
import type { IProductRepository } from '../repositories';
import { ProductSearchService } from './product-search.service';

export interface PaginatedProductsResponse {
  data: Product[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Injectable()
export class ProductsService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    private readonly brandService: BrandsService,
    private readonly categoryService: CategoriesService,
    private readonly productSearchService: ProductSearchService,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    // 1. Check SKU uniqueness
    const existingSku = await this.productRepository.findBySku(dto.sku);

    if (existingSku) {
      throw new ConflictException('Product with this SKU already exists');
    }

    // 2. Check category exists
    await this.categoryService.findOne(dto.categoryId);

    // 3. Check brand exists
    await this.brandService.findById(dto.brandId);

    // 4. Generate slug
    const slug = this.generateSlug(dto.name);

    // 5. Check slug uniqueness
    const existingSlug = await this.productRepository.findBySlug(slug);

    if (existingSlug) {
      throw new ConflictException('Product with this name already exists');
    }

    // 6. Create product
    return this.productRepository.create({
      ...dto,
      slug,
    });
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async search(dto: SearchProductsDto): Promise<PaginatedProductsResponse> {
    if (
      dto.minPrice !== undefined &&
      dto.maxPrice !== undefined &&
      dto.minPrice > dto.maxPrice
    ) {
      throw new BadRequestException('minPrice cannot be greater than maxPrice');
    }

    const { data, total } = await this.productRepository.search(
      this.productSearchService.buildQuery(dto),
    );

    return {
      data,
      meta: {
        page: dto.page,
        limit: dto.limit,
        total,
        totalPages: Math.ceil(total / dto.limit),
      },
    };
  }

  async findById(id: number): Promise<Product> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async findBySlug(slug: string): Promise<Product> {
    const product = await this.productRepository.findBySlug(slug);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    // Check product exists
    await this.findById(id);

    // Check SKU if updating
    if (dto.sku) {
      const existingSku = await this.productRepository.findBySku(dto.sku);

      if (existingSku && existingSku.id !== id) {
        throw new ConflictException('Product with this SKU already exists');
      }
    }

    // Check category if updating
    if (dto.categoryId) {
      await this.categoryService.findOne(dto.categoryId);
    }

    // Check brand if updating
    if (dto.brandId) {
      await this.brandService.findById(dto.brandId);
    }

    const data: UpdateProductDto & {
      slug?: string;
    } = {
      ...dto,
    };

    // Regenerate slug if name changes
    if (dto.name) {
      data.slug = this.generateSlug(dto.name);
    }

    return this.productRepository.update(id, data);
  }

  async softDelete(id: number): Promise<Product> {
    // Check product exists
    await this.findById(id);

    return this.productRepository.softDelete(id);
  }

  private generateSlug(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
}
