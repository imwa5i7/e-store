import { ProductPrice } from '@prisma/client';

export class ProductPriceEntity {
  id: number;
  productId: number;
  regularPrice: string;
  salePrice: string | null;
  currency: string;
  saleStartsAt: Date | null;
  saleEndsAt: Date | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(price: ProductPrice) {
    this.id = price.id;
    this.productId = price.productId;
    this.regularPrice = price.regularPrice.toFixed(2);
    this.salePrice = price.salePrice?.toFixed(2) ?? null;
    this.currency = price.currency;
    this.saleStartsAt = price.saleStartsAt;
    this.saleEndsAt = price.saleEndsAt;
    this.createdAt = price.createdAt;
    this.updatedAt = price.updatedAt;
  }
}
