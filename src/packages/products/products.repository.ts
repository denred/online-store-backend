import { type PrismaClient, type Product } from '@prisma/client';

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
