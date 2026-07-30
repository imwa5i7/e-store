import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, ProductPrice } from '@prisma/client';

import { ProductsService } from '@/modules/products';

import { CreatePriceDto } from '../dto/create-price.dto';
import { PriceResponseDto } from '../dto/price-response.dto';
import { UpdatePriceDto } from '../dto/update-price.dto';
import { PRICING_REPOSITORY } from '../pricing.constants';
import type { IPricingRepository } from '../repositories/pricing.repository.interface';

type PriceValues = {
  productId: number;
  regularPrice: Prisma.Decimal;
  salePrice: Prisma.Decimal | null;
  currency: string;
  saleStartsAt: Date | null;
  saleEndsAt: Date | null;
};

@Injectable()
export class PricingService {
  constructor(
    @Inject(PRICING_REPOSITORY)
    private readonly pricingRepository: IPricingRepository,
    private readonly productsService: ProductsService,
  ) {}

  async create(dto: CreatePriceDto): Promise<PriceResponseDto> {
    await this.productsService.findById(dto.productId);

    const existing = await this.pricingRepository.findByProductId(
      dto.productId,
    );
    if (existing) {
      throw new ConflictException('Pricing already exists for this product');
    }

    const values = this.createValues(dto);
    this.validateValues(values);

    try {
      const price = await this.pricingRepository.create(values);
      return this.toResponse(price);
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Pricing already exists for this product');
      }

      throw error;
    }
  }

  async findByProduct(productId: number): Promise<PriceResponseDto> {
    const price = await this.pricingRepository.findByProductId(productId);

    if (!price) {
      throw new NotFoundException('Pricing not found');
    }

    return this.toResponse(price);
  }

  async update(id: number, dto: UpdatePriceDto): Promise<PriceResponseDto> {
    const existing = await this.findPriceOrThrow(id);
    const isRemovingSale =
      dto.salePrice !== undefined && new Prisma.Decimal(dto.salePrice).eq(0);

    if (isRemovingSale && (dto.saleStartsAt || dto.saleEndsAt)) {
      throw new BadRequestException(
        'Sale dates cannot be supplied when removing a sale',
      );
    }

    if (dto.productId !== undefined && dto.productId !== existing.productId) {
      await this.productsService.findById(dto.productId);

      const targetPrice = await this.pricingRepository.findByProductId(
        dto.productId,
      );
      if (targetPrice && targetPrice.id !== existing.id) {
        throw new ConflictException('Pricing already exists for this product');
      }
    }

    const values = this.mergeValues(existing, dto, isRemovingSale);
    this.validateValues(values);

    try {
      const updatedPrice = await this.pricingRepository.update(id, values);
      return this.toResponse(updatedPrice);
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Pricing already exists for this product');
      }

      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    await this.findPriceOrThrow(id);
    await this.pricingRepository.delete(id);
  }

  async getCurrentPrice(productId: number): Promise<string> {
    const price = await this.findByProductRecordOrThrow(productId);
    const now = new Date();

    if (
      price.salePrice !== null &&
      price.saleStartsAt === null &&
      price.saleEndsAt === null
    ) {
      return price.salePrice.toFixed(2);
    }

    if (
      price.salePrice !== null &&
      price.saleStartsAt !== null &&
      price.saleEndsAt !== null &&
      now >= price.saleStartsAt &&
      now <= price.saleEndsAt
    ) {
      return price.salePrice.toFixed(2);
    }

    return price.regularPrice.toFixed(2);
  }

  private createValues(dto: CreatePriceDto): PriceValues {
    return {
      productId: dto.productId,
      regularPrice: new Prisma.Decimal(dto.regularPrice),
      salePrice:
        dto.salePrice === undefined ? null : new Prisma.Decimal(dto.salePrice),
      currency: dto.currency ?? 'PKR',
      saleStartsAt: dto.saleStartsAt ?? null,
      saleEndsAt: dto.saleEndsAt ?? null,
    };
  }

  private mergeValues(
    existing: ProductPrice,
    dto: UpdatePriceDto,
    isRemovingSale: boolean,
  ): PriceValues {
    return {
      productId: dto.productId ?? existing.productId,
      regularPrice:
        dto.regularPrice === undefined
          ? existing.regularPrice
          : new Prisma.Decimal(dto.regularPrice),
      salePrice: isRemovingSale
        ? null
        : dto.salePrice === undefined
          ? existing.salePrice
          : new Prisma.Decimal(dto.salePrice),
      currency: dto.currency ?? existing.currency,
      saleStartsAt: isRemovingSale
        ? null
        : (dto.saleStartsAt ?? existing.saleStartsAt),
      saleEndsAt: isRemovingSale
        ? null
        : (dto.saleEndsAt ?? existing.saleEndsAt),
    };
  }

  private validateValues(values: PriceValues): void {
    if (values.regularPrice.lte(0)) {
      throw new BadRequestException('Regular price must be greater than zero');
    }

    if (values.salePrice?.lte(0)) {
      throw new BadRequestException('Sale price must be greater than zero');
    }

    if (values.salePrice?.gt(values.regularPrice)) {
      throw new BadRequestException(
        'Sale price cannot exceed the regular price',
      );
    }

    const hasStartDate = values.saleStartsAt !== null;
    const hasEndDate = values.saleEndsAt !== null;
    if (hasStartDate !== hasEndDate) {
      throw new BadRequestException(
        'Sale start and end dates must be provided together',
      );
    }

    if (
      values.saleStartsAt !== null &&
      values.saleEndsAt !== null &&
      values.saleStartsAt >= values.saleEndsAt
    ) {
      throw new BadRequestException('Sale start date must be before end date');
    }
  }

  private async findPriceOrThrow(id: number): Promise<ProductPrice> {
    const price = await this.pricingRepository.findById(id);
    if (!price) {
      throw new NotFoundException('Pricing not found');
    }

    return price;
  }

  private async findByProductRecordOrThrow(
    productId: number,
  ): Promise<ProductPrice> {
    const price = await this.pricingRepository.findByProductId(productId);
    if (!price) {
      throw new NotFoundException('Pricing not found');
    }

    return price;
  }

  private toResponse(price: ProductPrice): PriceResponseDto {
    return new PriceResponseDto(price);
  }
}
