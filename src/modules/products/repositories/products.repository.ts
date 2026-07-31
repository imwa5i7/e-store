import { Injectable } from '@nestjs/common';
import { Product } from '@prisma/client';

import { PrismaService } from '@/database';

import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductSearchQuery } from '../services/product-search.service';
import { IProductRepository } from '../repositories';
import { ProductSearchResult } from './products.repository.interface';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductDto & { slug: string }): Promise<Product> {
    return this.prisma.product.create({
      data,
    });
  }

  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        images: true,
        inventory: true,
        price: true,
      },
    });
  }

  async search(query: ProductSearchQuery): Promise<ProductSearchResult> {
    const [total, data] = await this.prisma.$transaction([
      this.prisma.product.count({ where: query.where }),
      this.prisma.product.findMany({
        ...query,
        include: {
          category: true,
          brand: true,
          images: true,
          price: true,
          inventory: true,
          variants: {
            include: {
              optionValues: {
                include: {
                  optionValue: {
                    include: {
                      option: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),
    ]);

    return { total, data };
  }

  async findById(id: number): Promise<Product | null> {
    return this.prisma.product.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        images: true,
        inventory: true,
        price: true,
      },
    });
  }

  async findBySlug(slug: string): Promise<Product | null> {
    return this.prisma.product.findFirst({
      where: {
        slug,
        deletedAt: null,
      },
      include: {
        images: true,
        inventory: true,
        price: true,
      },
    });
  }

  async findBySku(sku: string): Promise<Product | null> {
    return this.prisma.product.findFirst({
      where: {
        sku,
        deletedAt: null,
      },
      include: {
        images: true,
        inventory: true,
        price: true,
      },
    });
  }

  async update(id: number, data: UpdateProductDto): Promise<Product> {
    return this.prisma.product.update({
      where: {
        id,
      },
      data,
    });
  }

  async softDelete(id: number): Promise<Product> {
    return this.prisma.product.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
