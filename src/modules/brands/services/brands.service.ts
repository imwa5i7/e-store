import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import slugify from 'slugify';

import { CreateBrandDto } from '../dto/create-brand.dto';
import { BrandResponseDto } from '../dto/brand-response.dto';
import { UpdateBrandDto } from '../dto/update-brand.dto';
import type { IBrandRepository } from '../repositories';
import { BRAND_REPOSITORY } from '../brands.constants';

@Injectable()
export class BrandsService {
  constructor(
    @Inject(BRAND_REPOSITORY)
    private readonly brandRepository: IBrandRepository,
  ) {}

  async create(dto: CreateBrandDto): Promise<BrandResponseDto> {
    const existing = await this.brandRepository.findByName(dto.name);

    if (existing) {
      throw new ConflictException(`Brand '${dto.name}' already exists.`);
    }

    const slug = slugify(dto.name, {
      lower: true,
      strict: true,
      trim: true,
    });

    const brand = await this.brandRepository.create({
      ...dto,
      slug,
    });

    return new BrandResponseDto(brand);
  }

  async findAll(): Promise<BrandResponseDto[]> {
    const brands = await this.brandRepository.findAll();

    return brands.map((brand) => new BrandResponseDto(brand));
  }

  async findById(id: number): Promise<BrandResponseDto> {
    const brand = await this.brandRepository.findById(id);

    if (!brand) {
      throw new NotFoundException('Brand not found.');
    }

    return new BrandResponseDto(brand);
  }

  async findBySlug(slug: string): Promise<BrandResponseDto> {
    const brand = await this.brandRepository.findBySlug(slug);

    if (!brand) {
      throw new NotFoundException('Brand not found.');
    }

    return new BrandResponseDto(brand);
  }

  async update(
    id: number,
    data: UpdateBrandDto & { slug?: string },
  ): Promise<BrandResponseDto> {
    await this.findById(id);

    if (data.name) {
      const existing = await this.brandRepository.findByName(data.name);

      if (existing && existing.id !== id) {
        throw new ConflictException(`Brand '${data.name}' already exists.`);
      }

      data = {
        ...data,
        slug: slugify(data.name, {
          lower: true,
          strict: true,
          trim: true,
        }),
      };
    }

    const brand = await this.brandRepository.update(id, data);

    return new BrandResponseDto(brand);
  }

  async remove(id: number): Promise<void> {
    await this.findById(id);

    await this.brandRepository.remove(id);
  }
}
