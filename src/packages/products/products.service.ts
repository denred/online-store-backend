import { type Product } from '@prisma/client';

import { type IService } from '~/libs/interfaces/interfaces.js';

import { type ProductRepository } from './products.repository.js';

class ProductsService implements IService {
  private productRepository: ProductRepository;

  public constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  public async findAll(): Promise<Product[]> {
    return await this.productRepository.findAll();
  }

  public async findById(id: string): Promise<Product | null> {
    const [product = null] = await this.productRepository.findById(id);

    return product;
  }

  public async create(payload: Product): Promise<Product> {
    return await this.productRepository.create(payload);
  }

  public async update(id: string, payload: Product): Promise<Product> {
    return await this.productRepository.update(id, payload);
  }

  public async delete(id: string): Promise<boolean> {
    return await this.productRepository.delete(id);
  }
}

export { ProductsService };
