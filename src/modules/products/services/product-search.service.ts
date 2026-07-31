import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { SearchProductsDto } from '../dto/search-products.dto';

export interface ProductSearchQuery {
  where: Prisma.ProductWhereInput;
  orderBy: Prisma.ProductOrderByWithRelationInput;
  skip: number;
  take: number;
}

@Injectable()
export class ProductSearchService {
  buildQuery(dto: SearchProductsDto): ProductSearchQuery {
    const where: Prisma.ProductWhereInput = { deletedAt: null };

    if (dto.search?.trim()) {
      const search = dto.search.trim();
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { name: { contains: search, mode: 'insensitive' } } },
        { category: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (dto.categoryId !== undefined) where.categoryId = dto.categoryId;
    if (dto.brandId !== undefined) where.brandId = dto.brandId;
    if (dto.status !== undefined) where.status = dto.status;
    if (dto.isFeatured !== undefined) where.isFeatured = dto.isFeatured;

    if (dto.minPrice !== undefined || dto.maxPrice !== undefined) {
      where.price = {
        is: {
          regularPrice: {
            ...(dto.minPrice !== undefined ? { gte: dto.minPrice } : {}),
            ...(dto.maxPrice !== undefined ? { lte: dto.maxPrice } : {}),
          },
        },
      };
    }

    if (dto.inStock) {
      where.inventory = { is: { quantity: { gt: 0 } } };
    }

    const optionFilters = Object.entries(dto.variantFilters ?? {}).filter(
      ([name, value]) => name.trim() && value.trim(),
    );
    if (optionFilters.length > 0) {
      where.variants = {
        some: {
          AND: optionFilters.map(([name, value]) => ({
            optionValues: {
              some: {
                optionValue: {
                  value,
                  option: { name },
                },
              },
            },
          })),
        },
      };
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      dto.sortBy === 'price'
        ? { price: { regularPrice: dto.sortOrder } }
        : { [dto.sortBy]: dto.sortOrder };

    return {
      where,
      orderBy,
      skip: (dto.page - 1) * dto.limit,
      take: dto.limit,
    };
  }
}
