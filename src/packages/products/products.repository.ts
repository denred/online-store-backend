import { type Prisma, type PrismaClient, type Product } from '@prisma/client';

import { ProductSortParameter } from '~/libs/enums/product-sort-parameter.enum.js';
import { type IRepository } from '~/libs/interfaces/interfaces.js';
import { type PaginatedQuery } from '~/libs/types/types.js';

import { getSkip, getTake } from './libs/helpers/helpers.js';
import { type GetFilteredProductRequestDto } from './libs/types/types.js';

class ProductsRepository implements IRepository {
  private db: Pick<PrismaClient, 'product'>;

  public constructor(database: Pick<PrismaClient, 'product'>) {
    this.db = database;
  }

  public async count(): Promise<number> {
    return this.db.product.count();
  }

  public async findAll(query: PaginatedQuery): Promise<Product[]> {
    return this.db.product.findMany({
      skip: getSkip(query),
      take: getTake(query, await this.count()),
    });
  }

  public async findById(id: string): Promise<Product[]> {
    return this.db.product.findMany({ where: { id } });
  }

  public async search(
    payload: Partial<Product>,
    query: PaginatedQuery,
  ): Promise<Product[]> {
    const { category, subcategory, colour, size, files, ...rest } = payload;

    const whereClause: Prisma.ProductWhereInput = {
      ...(category && { category: { equals: category } }),
      ...(subcategory && { subcategory: { equals: subcategory } }),
      ...(colour && { colour: { equals: colour } }),
      ...(size && { size: { hasSome: size } }),
      ...(files && { files: { hasSome: files } }),
      ...rest,
    };

    return this.db.product.findMany({
      skip: getSkip(query),
      take: getTake(query, await this.count()),
      where: whereClause,
    });
  }

  public async getSortedAndFilteredProducts(
    payload: GetFilteredProductRequestDto,
    query: PaginatedQuery,
  ): Promise<Product[]> {
    const { colours, sizes, priceRange } = payload;
    const { sorting } = query;

    const whereClause: Prisma.ProductWhereInput = {
      ...(colours && { colour: { in: colours } }),
      ...(sizes && { size: { hasSome: sizes } }),
      ...(priceRange && {
        price: { gte: priceRange.min, lte: priceRange.max },
      }),
    };

    return this.db.product.findMany({
      skip: getSkip(query),
      take: getTake(query, await this.count()),
      where: whereClause,
      orderBy: {
        ...(sorting === ProductSortParameter.PRICE_ASC && { price: 'asc' }),
        ...(sorting === ProductSortParameter.PRICE_DESC && { price: 'desc' }),
      },
    });
  }

  public async create(
    payload: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Product> {
    return this.db.product.create({ data: payload });
  }

  public async update(id: string, payload: Partial<Product>): Promise<Product> {
    return this.db.product.update({
      where: { id },
      data: payload,
    });
  }

  public async delete(id: string): Promise<boolean> {
    return !!(await this.db.product.delete({ where: { id } }));
  }

  public async getMaxVendorCode(): Promise<number | null> {
    const lastProduct = await this.db.product.findFirst({
      select: { vendorCode: true },
      orderBy: { vendorCode: 'desc' },
    });

    return lastProduct?.vendorCode ?? null;
  }
}

export { ProductsRepository };
