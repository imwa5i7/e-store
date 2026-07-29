import { Brand } from '@prisma/client';

import { CreateBrandDto } from '../dto/create-brand.dto';
import { UpdateBrandDto } from '../dto/update-brand.dto';

export interface IBrandRepository {
  create(data: CreateBrandDto & { slug: string }): Promise<Brand>;

  findAll(): Promise<Brand[]>;

  findById(id: number): Promise<Brand | null>;

  findBySlug(slug: string): Promise<Brand | null>;

  findByName(name: string): Promise<Brand | null>;

  update(id: number, data: UpdateBrandDto): Promise<Brand>;

  remove(id: number): Promise<Brand>;
}
