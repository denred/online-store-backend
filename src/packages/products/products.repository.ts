import { type Prisma, type PrismaClient, type Product } from '@prisma/client';

import { type IRepository } from '~/libs/interfaces/interfaces.js';
import { type PaginatedQuery } from '~/libs/types/types.js';

import { getSkip, getTake } from './libs/helpers/helpers.js';

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
}

export { ProductsRepository };
