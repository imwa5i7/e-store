import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ProductsService } from '@/modules/products';
import { CreateProductOptionDto } from '../dto/create-product-option.dto';
import { CreateProductOptionValueDto } from '../dto/create-product-option-value.dto';
import { ProductOptionResponseDto } from '../dto/product-option-response.dto';
import { UpdateProductOptionDto } from '../dto/update-product-option.dto';
import { PRODUCT_OPTIONS_REPOSITORY } from '../product-options.constants';
import type {
  IProductOptionsRepository,
  ProductOptionWithValues,
} from '../repositories/product-options.repository.interface';

@Injectable()
export class ProductOptionsService {
  constructor(
    @Inject(PRODUCT_OPTIONS_REPOSITORY)
    private readonly optionsRepository: IProductOptionsRepository,
    private readonly productsService: ProductsService,
  ) {}
  async createOption(
    productId: number,
    dto: CreateProductOptionDto,
  ): Promise<ProductOptionResponseDto> {
    await this.productsService.findById(productId);
    await this.ensureNameAvailable(productId, dto.name);
    try {
      return this.toResponse(
        await this.optionsRepository.create({
          product: { connect: { id: productId } },
          name: dto.name,
        }),
      );
    } catch (error: unknown) {
      this.rethrowConflict(
        error,
        'Option name already exists for this product',
      );
    }
  }
  async addOptionValue(
    optionId: number,
    dto: CreateProductOptionValueDto,
  ): Promise<ProductOptionResponseDto> {
    await this.findOptionOrThrow(optionId);
    try {
      return this.toResponse(
        await this.optionsRepository.createValue(optionId, dto.value),
      );
    } catch (error: unknown) {
      this.rethrowConflict(error, 'Option value already exists');
    }
  }
  async getOptions(productId: number): Promise<ProductOptionResponseDto[]> {
    await this.productsService.findById(productId);
    return (await this.optionsRepository.findAllByProduct(productId)).map(
      (option) => this.toResponse(option),
    );
  }
  async updateOption(
    id: number,
    dto: UpdateProductOptionDto,
  ): Promise<ProductOptionResponseDto> {
    const existing = await this.findOptionOrThrow(id);
    if (dto.name !== undefined && dto.name !== existing.name)
      await this.ensureNameAvailable(existing.productId, dto.name);
    try {
      return this.toResponse(await this.optionsRepository.update(id, dto));
    } catch (error: unknown) {
      this.rethrowConflict(
        error,
        'Option name already exists for this product',
      );
    }
  }
  async deleteOption(id: number): Promise<void> {
    await this.findOptionOrThrow(id);
    await this.optionsRepository.delete(id);
  }
  private async ensureNameAvailable(
    productId: number,
    name: string,
  ): Promise<void> {
    if (await this.optionsRepository.findByProductIdAndName(productId, name))
      throw new ConflictException(
        'Option name already exists for this product',
      );
  }
  private async findOptionOrThrow(
    id: number,
  ): Promise<ProductOptionWithValues> {
    const option = await this.optionsRepository.findById(id);
    if (!option) throw new NotFoundException('Product option not found');
    return option;
  }
  private rethrowConflict(error: unknown, message: string): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    )
      throw new ConflictException(message);
    throw error;
  }
  private toResponse(
    option: ProductOptionWithValues,
  ): ProductOptionResponseDto {
    return {
      id: option.id,
      productId: option.productId,
      name: option.name,
      values: option.values.map((value) => ({
        id: value.id,
        value: value.value,
        createdAt: value.createdAt,
        updatedAt: value.updatedAt,
      })),
      createdAt: option.createdAt,
      updatedAt: option.updatedAt,
    };
  }
}
