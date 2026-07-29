import { Product } from '@prisma/client';

import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

export interface IProductRepository {
  create(data: CreateProductDto & { slug: string }): Promise<Product>;

  findAll(): Promise<Product[]>;

  findById(id: number): Promise<Product | null>;

  findBySlug(slug: string): Promise<Product | null>;

  findBySku(sku: string): Promise<Product | null>;

  update(id: number, data: UpdateProductDto): Promise<Product>;

  softDelete(id: number): Promise<Product>;
}
