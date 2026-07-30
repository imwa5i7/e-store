import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ProductsService } from '@/modules/products';
import { CreateVariantDto } from '../dto/create-variant.dto';
import { UpdateVariantDto } from '../dto/update-variant.dto';
import { VariantResponseDto } from '../dto/variant-response.dto';
import { VARIANTS_REPOSITORY } from '../variants.constants';
import type {
  IVariantsRepository,
  VariantWithOptionValues,
} from '../repositories/variants.repository.interface';

@Injectable()
export class VariantsService {
  constructor(
    @Inject(VARIANTS_REPOSITORY)
    private readonly variantsRepository: IVariantsRepository,
    private readonly productsService: ProductsService,
  ) {}

  async createVariant(
    productId: number,
    dto: CreateVariantDto,
  ): Promise<VariantResponseDto> {
    await this.productsService.findById(productId);
    await this.ensureSkuAvailable(dto.sku);
    await this.validateOptionValues(productId, dto.optionValueIds);
    try {
      const variant = await this.variantsRepository.create({
        product: { connect: { id: productId } },
        sku: dto.sku,
        isDefault: dto.isDefault ?? false,
        isActive: dto.isActive ?? true,
        optionValues: {
          create: dto.optionValueIds.map((optionValueId) => ({
            optionValue: { connect: { id: optionValueId } },
          })),
        },
      });
      return this.toResponse(variant);
    } catch (error: unknown) {
      this.rethrowConflict(error, 'Variant SKU already exists');
    }
  }

  async getVariants(productId: number): Promise<VariantResponseDto[]> {
    await this.productsService.findById(productId);
    return (await this.variantsRepository.findAllByProduct(productId)).map(
      (variant) => this.toResponse(variant),
    );
  }
  async getVariant(id: number): Promise<VariantResponseDto> {
    return this.toResponse(await this.findVariantOrThrow(id));
  }

  async updateVariant(
    id: number,
    dto: UpdateVariantDto,
  ): Promise<VariantResponseDto> {
    const existing = await this.findVariantOrThrow(id);
    if (dto.sku !== undefined && dto.sku !== existing.sku)
      await this.ensureSkuAvailable(dto.sku);
    if (dto.optionValueIds !== undefined)
      await this.validateOptionValues(existing.productId, dto.optionValueIds);
    const data: Prisma.ProductVariantUpdateInput = {
      ...(dto.sku !== undefined && { sku: dto.sku }),
      ...(dto.isDefault !== undefined && { isDefault: dto.isDefault }),
      ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      ...(dto.optionValueIds !== undefined && {
        optionValues: {
          deleteMany: {},
          create: dto.optionValueIds.map((optionValueId) => ({
            optionValue: { connect: { id: optionValueId } },
          })),
        },
      }),
    };
    try {
      return this.toResponse(await this.variantsRepository.update(id, data));
    } catch (error: unknown) {
      this.rethrowConflict(
        error,
        'Variant SKU or option value assignment already exists',
      );
    }
  }

  async deleteVariant(id: number): Promise<void> {
    const variant = await this.findVariantOrThrow(id);
    if ((await this.variantsRepository.countByProduct(variant.productId)) <= 1)
      throw new BadRequestException(
        'Cannot delete the last variant of a product',
      );
    await this.variantsRepository.delete(id);
  }

  private async validateOptionValues(
    productId: number,
    optionValueIds: number[],
  ): Promise<void> {
    if (optionValueIds.length === 0)
      throw new BadRequestException(
        'A variant must include at least one option value',
      );
    const optionValues =
      await this.variantsRepository.findOptionValuesByIds(optionValueIds);
    if (
      optionValues.length !== optionValueIds.length ||
      optionValues.some((value) => value.option.productId !== productId)
    )
      throw new BadRequestException('Option values must belong to the product');
    if (
      new Set(optionValues.map((value) => value.optionId)).size !==
      optionValues.length
    )
      throw new BadRequestException(
        'A variant can contain only one value per option',
      );
  }

  private async ensureSkuAvailable(sku: string): Promise<void> {
    if (await this.variantsRepository.findBySku(sku))
      throw new ConflictException('Variant SKU already exists');
  }
  private async findVariantOrThrow(
    id: number,
  ): Promise<VariantWithOptionValues> {
    const variant = await this.variantsRepository.findById(id);
    if (!variant) throw new NotFoundException('Variant not found');
    return variant;
  }
  private rethrowConflict(error: unknown, message: string): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    )
      throw new ConflictException(message);
    throw error;
  }
  private toResponse(variant: VariantWithOptionValues): VariantResponseDto {
    return {
      id: variant.id,
      productId: variant.productId,
      sku: variant.sku,
      isDefault: variant.isDefault,
      isActive: variant.isActive,
      optionValues: variant.optionValues.map(({ optionValue }) => ({
        id: optionValue.id,
        value: optionValue.value,
        optionName: optionValue.option.name,
      })),
      createdAt: variant.createdAt,
      updatedAt: variant.updatedAt,
    };
  }
}
