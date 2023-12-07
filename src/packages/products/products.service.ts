import { type Product, Subcategory } from '@prisma/client';

import { HttpError } from '~/libs/exceptions/http-error.exception.js';
import { type IService } from '~/libs/interfaces/interfaces.js';
import { HttpCode, HttpMessage } from '~/libs/packages/http/http.js';
import { type PaginatedQuery } from '~/libs/types/types.js';

import { type FilesService } from '../files/files.js';
import { ProductValidationRules } from './libs/enums/product-validation-rules.enum.js';
import { getBuildId, getBuildImageName } from './libs/helpers/helpers.js';
import {
  type CreateProductDto,
  type ImageUrl,
  type TopCategory,
} from './libs/types/types.js';
import { type ProductsRepository } from './products.repository.js';

class ProductsService implements IService {
  private productsRepository: ProductsRepository;

  private filesService: FilesService;

  public constructor(
    productsRepository: ProductsRepository,
    filesService: FilesService,
  ) {
    this.productsRepository = productsRepository;
    this.filesService = filesService;
  }

  public updateProductQuantity(id: string, quantity: number): Promise<Product> {
    return this.productsRepository.update(id, { quantity });
  }

  public async findAll(query: PaginatedQuery): Promise<Product[]> {
    return await this.productsRepository.findAll(query);
  }

  public async findById(id: string): Promise<Product | null> {
    this.isValidPrismaId(id);

    const [product = null] = await this.productsRepository.findById(id);

    return product;
  }

  public async create(payload: CreateProductDto): Promise<Product> {
    const { files } = payload;

    await this.validateFiles(files);

    return await this.productsRepository.create(payload);
  }

  public async update(id: string, payload: Partial<Product>): Promise<Product> {
    await this.getProductOrThrowError(id);

    return await this.productsRepository.update(id, payload);
  }

  public async delete(id: string): Promise<boolean> {
    await this.getProductOrThrowError(id);

    return await this.productsRepository.delete(id);
  }

  public async search(
    payload: Partial<Product>,
    query: PaginatedQuery,
  ): Promise<Product[]> {
    return await this.productsRepository.search(payload, query);
  }

  private async validateFiles(files: string[]): Promise<void> {
    for (const id of files) {
      await this.filesService.getUrlById(id);
    }
  }

  private isValidPrismaId(id: string): void {
    const isValidPrismaId =
      typeof id === 'string' && id.length === ProductValidationRules.ID_LENGTH;

    if (!isValidPrismaId) {
      throw new HttpError({
        message: HttpMessage.INVALID_ID,
      });
    }
  }

  private async getProductOrThrowError(id: string): Promise<Product> {
    const product = await this.findById(id);

    if (!product) {
      throw new HttpError({
        status: HttpCode.NOT_FOUND,
        message: HttpMessage.PRODUCT_DOES_NOT_EXIST,
      });
    }

    return product;
  }

  public async getTopCategories(): Promise<TopCategory[]> {
    const subcategories: Subcategory[] = [
      Subcategory.JACKETS,
      Subcategory.SWEATERS,
      Subcategory.OVERSHIRTS,
      Subcategory.QUILTED,
    ];
    const IMAGE_POSITION = 6;
    const topCategories: TopCategory[] = [];

    for (const subcategory of subcategories) {
      const [product] = await this.search(
        { subcategory },
        { size: 1, page: 0 },
      );

      if (product) {
        const { title, files } = product;
        const imageUrl = files[IMAGE_POSITION]
          ? await this.filesService.getUrlById(files[IMAGE_POSITION])
          : null;

        if (title && imageUrl) {
          topCategories.push({
            id: getBuildId(title),
            name: subcategory,
            url: imageUrl,
          });
        }
      }
    }

    return topCategories;
  }

  public async getImages(id: string): Promise<ImageUrl[]> {
    this.isValidPrismaId(id);

    const product = await this.findById(id);

    if (!product) {
      throw new HttpError({
        status: HttpCode.BAD_REQUEST,
        message: HttpMessage.PRODUCT_DOES_NOT_EXIST,
      });
    }

    const { title, files } = product;
    const images: ImageUrl[] = [];

    for (const id of files) {
      const url = await this.filesService.getUrlById(id);
      const file = await this.filesService.findById(id);

      if (file) {
        const name = getBuildImageName(title, file.name);

        images.push({ id, name, url });
      }
    }

    return images;
  }

  public async getNewProducts(): Promise<Product[]> {
    const newProductIds = [
      '65609126e73218a5606f2272',
      '656092e6e73218a5606f227a',
      '656493ae89f5931a88a1b9db',
    ];

    const products: Product[] = [];

    for (const id of newProductIds) {
      const product = await this.findById(id);

      if (product) {
        products.push(product);
      }
    }

    return products;
  }
}

export { ProductsService };
