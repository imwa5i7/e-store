import { Category, Prisma } from '@prisma/client';

export interface ICategoriesRepository {
  create(data: Prisma.CategoryCreateInput): Promise<Category>;

  findAll(): Promise<Category[]>;

  findById(id: number): Promise<Category | null>;

  findByIdIncludingDeleted(id: number): Promise<Category | null>;

  findBySlug(slug: string): Promise<Category | null>;

  update(id: number, data: Prisma.CategoryUpdateInput): Promise<Category>;

  softDelete(id: number): Promise<Category>;

  restore(id: number): Promise<Category>;

  existsByName(
    name: string,
    parentId?: number,
    excludeId?: number,
  ): Promise<boolean>;

  hasChildren(id: number): Promise<boolean>;

  findChildren(id: number): Promise<Category[]>;
}
