import { Injectable } from '@nestjs/common';
import { Brand } from '@prisma/client';

import { PrismaService } from '@/database';
import { CreateBrandDto } from '../dto/create-brand.dto';
import { UpdateBrandDto } from '../dto/update-brand.dto';
import { IBrandRepository } from './brands.repository.interface';

@Injectable()
export class BrandRepository implements IBrandRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateBrandDto & { slug: string }): Promise<Brand> {
    return this.prisma.brand.create({
      data,
    });
  }

  async findAll(): Promise<Brand[]> {
    return this.prisma.brand.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: number): Promise<Brand | null> {
    return this.prisma.brand.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async findBySlug(slug: string): Promise<Brand | null> {
    return this.prisma.brand.findFirst({
      where: {
        slug,
        deletedAt: null,
      },
    });
  }

  async findByName(name: string): Promise<Brand | null> {
    return this.prisma.brand.findFirst({
      where: {
        name,
        deletedAt: null,
      },
    });
  }

  async update(id: number, data: UpdateBrandDto): Promise<Brand> {
    return this.prisma.brand.update({
      where: {
        id,
      },
      data,
    });
  }

  async remove(id: number): Promise<Brand> {
    return this.prisma.brand.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
