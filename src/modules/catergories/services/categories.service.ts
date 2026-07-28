import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import slugify from 'slugify';

import {
  CategoryResponseDto,
  CategoryTreeResponseDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../dto';
import { CategoriesRepository } from '../repositories/categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async create(dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    if (await this.categoriesRepository.existsByName(dto.name)) {
      throw new ConflictException('A category with this name already exists.');
    }

    let parent: any = null;

    if (dto.parentId) {
      parent = await this.categoriesRepository.findById(dto.parentId);

      if (!parent) {
        throw new NotFoundException('Parent category not found.');
      }
    }

    const slug = await this.generateUniqueSlug(dto.name);

    const createData: any = {
      name: dto.name,
      slug,
      description: dto.description,
      imageUrl: dto.imageUrl,
      sortOrder: dto.sortOrder ?? 0,
    };

    if (parent) {
      // parent may be null; ensure correct shape for repository
      createData.parent = {
        connect: {
          id: parent.id,
        },
      };
    }

    const category = await this.categoriesRepository.create(createData);

    return new CategoryResponseDto(category);
  }

  async findAll(): Promise<CategoryResponseDto[]> {
    const categories = await this.categoriesRepository.findAll();

    return categories.map((category) => new CategoryResponseDto(category));
  }

  async findOne(id: number): Promise<CategoryResponseDto> {
    const category = await this.categoriesRepository.findById(id);

    if (!category) {
      throw new NotFoundException('Category not found.');
    }

    return new CategoryResponseDto(category);
  }

  async update(
    id: number,
    dto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoriesRepository.findById(id);

    if (!category) {
      throw new NotFoundException('Category not found.');
    }

    if (dto.parentId === id) {
      throw new BadRequestException('A category cannot be its own parent.');
    }

    if (dto.parentId) {
      const parent = await this.categoriesRepository.findById(dto.parentId);

      if (!parent) {
        throw new NotFoundException('Parent category not found.');
      }
    }

    let slug = category.slug;

    if (dto.name && dto.name !== category.name) {
      if (await this.categoriesRepository.existsByName(dto.name)) {
        throw new ConflictException(
          'A category with this name already exists.',
        );
      }

      slug = await this.generateUniqueSlug(dto.name);
    }

    const updated = await this.categoriesRepository.update(id, {
      name: dto.name,
      slug,
      description: dto.description,
      imageUrl: dto.imageUrl,
      sortOrder: dto.sortOrder,
      ...(dto.parentId !== undefined && {
        parent: dto.parentId
          ? {
              connect: {
                id: dto.parentId,
              },
            }
          : {
              disconnect: true,
            },
      }),
    });

    return new CategoryResponseDto(updated);
  }

  async remove(id: number): Promise<void> {
    const category = await this.categoriesRepository.findById(id);

    if (!category) {
      throw new NotFoundException('Category not found.');
    }

    await this.categoriesRepository.softDelete(id);
  }

  async restore(id: number): Promise<CategoryResponseDto> {
    const category =
      await this.categoriesRepository.findByIdIncludingDeleted(id);

    if (!category) {
      throw new NotFoundException('Category not found.');
    }

    if (category.deletedAt === null) {
      throw new BadRequestException('Category is already active.');
    }

    const restored = await this.categoriesRepository.restore(id);

    return new CategoryResponseDto(restored);
  }

  private async generateUniqueSlug(name: string): Promise<string> {
    let slug = slugify(name, {
      lower: true,
      strict: true,
      trim: true,
    });

    let counter = 1;

    while (await this.categoriesRepository.findBySlug(slug)) {
      slug = `${slugify(name, {
        lower: true,
        strict: true,
        trim: true,
      })}-${counter++}`;
    }

    return slug;
  }

  async getTree(): Promise<CategoryTreeResponseDto[]> {
    const categories = await this.categoriesRepository.findAll();

    const map = new Map<number, CategoryTreeResponseDto>();

    categories.forEach((category) => {
      map.set(category.id, {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        imageUrl: category.imageUrl,
        sortOrder: category.sortOrder,
        isActive: category.isActive,
        parentId: category.parentId,
        children: [],
      });
    });

    const tree: CategoryTreeResponseDto[] = [];

    map.forEach((category) => {
      if (category.parentId === null) {
        tree.push(category);
      } else {
        const parent = map.get(category.parentId);

        if (parent) {
          parent.children.push(category);
        }
      }
    });

    return tree;
  }
}
