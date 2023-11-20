import { type Product } from '@prisma/client';

import { type IService } from '~/libs/interfaces/interfaces.js';

import { type ProductsRepository } from './products.repository.js';

class ProductsService implements IService {
  private productsRepository: ProductsRepository;

  public constructor(productsRepository: ProductsRepository) {
    this.productsRepository = productsRepository;
  }

  public async findAll(): Promise<Product[]> {
    return await this.productsRepository.findAll();
  }

  public async findById(id: string): Promise<Product | null> {
    const [product = null] = await this.productsRepository.findById(id);

    return product;
  }

  public async create(payload: Product): Promise<Product> {
    return await this.productsRepository.create(payload);
  }

  public async update(id: string, payload: Partial<Product>): Promise<Product> {
    return await this.productsRepository.update(id, payload);
  }

  public async delete(id: string): Promise<boolean> {
    return await this.productsRepository.delete(id);
  }
}

export { ProductsService };
