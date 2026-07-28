import { Injectable } from '@nestjs/common';
import { Category, Prisma } from '@prisma/client';

import { PrismaService } from '@/database';
import { ICategoriesRepository } from '../repositories/categories.repository.interface';

@Injectable()
export class CategoriesRepository implements ICategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.CategoryCreateInput): Promise<Category> {
    return this.prisma.category.create({
      data,
    });
  }

  async findAll(): Promise<Category[]> {
    return this.prisma.category.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: [
        {
          sortOrder: 'asc',
        },
        {
          name: 'asc',
        },
      ],
    });
  }

  async findById(id: number): Promise<Category | null> {
    return this.prisma.category.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async findByIdIncludingDeleted(id: number): Promise<Category | null> {
    return this.prisma.category.findUnique({
      where: {
        id,
      },
    });
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return this.prisma.category.findFirst({
      where: {
        slug,
        deletedAt: null,
      },
    });
  }

  async update(
    id: number,
    data: Prisma.CategoryUpdateInput,
  ): Promise<Category> {
    return this.prisma.category.update({
      where: {
        id,
      },
      data,
    });
  }

  async softDelete(id: number): Promise<Category> {
    return this.prisma.category.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async restore(id: number): Promise<Category> {
    return this.prisma.category.update({
      where: {
        id,
      },
      data: {
        deletedAt: null,
      },
    });
  }

  async existsByName(
    name: string,
    parentId?: number,
    excludeId?: number,
  ): Promise<boolean> {
    const category = await this.prisma.category.findFirst({
      where: {
        name,
        parentId: parentId ?? null,
        deletedAt: null,
        ...(excludeId !== undefined && {
          NOT: {
            id: excludeId,
          },
        }),
      },
      select: {
        id: true,
      },
    });

    return category !== null;
  }

  async hasChildren(id: number): Promise<boolean> {
    const child = await this.prisma.category.findFirst({
      where: {
        parentId: id,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

    return child !== null;
  }

  async findChildren(id: number): Promise<Category[]> {
    return this.prisma.category.findMany({
      where: {
        parentId: id,
        deletedAt: null,
      },
      orderBy: {
        sortOrder: 'asc',
      },
    });
  }
}
