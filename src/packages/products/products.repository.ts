import { type Prisma, type PrismaClient, type Product } from '@prisma/client';

import { type IRepository } from '~/libs/interfaces/interfaces.js';

class ProductsRepository implements IRepository {
  private db: Pick<PrismaClient, 'product'>;

  public constructor(database: Pick<PrismaClient, 'product'>) {
    this.db = database;
  }

  public async findAll(): Promise<Product[]> {
    return await this.db.product.findMany();
  }

  public async findById(id: string): Promise<Product[]> {
    return await this.db.product.findMany({ where: { id } });
  }

  public async find(payload: Partial<Product>): Promise<Product[]> {
    const { category, subcategory, colour, size, files, ...rest } = payload;

    const whereClause: Prisma.ProductWhereInput = {
      ...(category && { category: { equals: category } }),
      ...(subcategory && { subcategory: { equals: subcategory } }),
      ...(colour && { colour: { equals: colour } }),
      ...(size && { size: { hasSome: size } }),
      ...(files && { files: { hasSome: files } }),
      ...rest,
    };

    return await this.db.product.findMany({ where: whereClause });
  }

  public async create(
    payload: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Product> {
    return await this.db.product.create({ data: payload });
  }

  public async update(id: string, payload: Partial<Product>): Promise<Product> {
    return await this.db.product.update({
      where: { id },
      data: payload,
    });
  }

  public async delete(id: string): Promise<boolean> {
    return !!(await this.db.product.delete({ where: { id } }));
  }
}

export { ProductsRepository };
