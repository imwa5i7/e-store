import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type {
  IProductImagesRepository,
  IProductRepository,
} from '../repositories';
import {
  PRODUCT_IMAGES_REPOSITORY,
  PRODUCT_REPOSITORY,
} from '../product.constants';
import { CreateProductImageDto } from '../dto/create-product-image.dto';
import { UpdateProductImageDto } from '../dto/update-product-image.dto';
import { ProductImageResponseDto } from '../dto/product-image-response.dto';

@Injectable()
export class ProductImagesService {
  constructor(
    @Inject(PRODUCT_IMAGES_REPOSITORY)
    private readonly productImagesRepository: IProductImagesRepository,

    @Inject(PRODUCT_REPOSITORY)
    private readonly productsRepository: IProductRepository,
  ) {}

  async create(
    productId: number,
    dto: CreateProductImageDto,
  ): Promise<ProductImageResponseDto> {
    const product = await this.productsRepository.findById(productId);

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found.`);
    }

    if (dto.isPrimary) {
      await this.productImagesRepository.clearPrimary(productId);
    }

    const image = await this.productImagesRepository.create({
      imageUrl: dto.imageUrl,
      altText: dto.altText,
      isPrimary: dto.isPrimary ?? false,
      sortOrder: dto.sortOrder ?? 0,
      product: {
        connect: {
          id: productId,
        },
      },
    });

    return new ProductImageResponseDto(image);
  }

  async findAll(productId: number): Promise<ProductImageResponseDto[]> {
    const product = await this.productsRepository.findById(productId);

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found.`);
    }

    const images =
      await this.productImagesRepository.findByProductId(productId);

    return images.map((image) => new ProductImageResponseDto(image));
  }

  async update(
    imageId: number,
    dto: UpdateProductImageDto,
  ): Promise<ProductImageResponseDto> {
    const image = await this.productImagesRepository.findById(imageId);

    if (!image) {
      throw new NotFoundException(`Image with ID ${imageId} not found.`);
    }

    if (dto.isPrimary) {
      await this.productImagesRepository.clearPrimary(image.productId);
    }

    const updated = await this.productImagesRepository.update(imageId, dto);

    return new ProductImageResponseDto(updated);
  }

  async remove(imageId: number): Promise<void> {
    const image = await this.productImagesRepository.findById(imageId);

    if (!image) {
      throw new NotFoundException(`Image with ID ${imageId} not found.`);
    }

    await this.productImagesRepository.delete(imageId);
  }

  async setPrimary(imageId: number): Promise<ProductImageResponseDto> {
    const image = await this.productImagesRepository.findById(imageId);

    if (!image) {
      throw new NotFoundException(`Image with ID ${imageId} not found.`);
    }

    await this.productImagesRepository.clearPrimary(image.productId);

    const primary = await this.productImagesRepository.setPrimary(imageId);

    return new ProductImageResponseDto(primary);
  }
}
