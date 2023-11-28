import { type Product, type Subcategory } from '@prisma/client';

import { HttpError } from '~/libs/exceptions/http-error.exception.js';
import { type IService } from '~/libs/interfaces/interfaces.js';
import { HttpCode, HttpMessage } from '~/libs/packages/http/http.js';
import { type PaginatedQuery } from '~/libs/types/types.js';

import { type FilesService } from '../files/files.js';
import { ProductValidationRules } from './libs/enums/product-validation-rules.enum.js';
import { buildId } from './libs/helpers/helpers.js';
import { type CreateProductDto } from './libs/types/create-product-dto.type.js';
import { type TopCategory } from './libs/types/types.js';
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
    await this.isProductExist(id);

    return await this.productsRepository.update(id, payload);
  }

  public async delete(id: string): Promise<boolean> {
    await this.isProductExist(id);

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
        status: HttpCode.BAD_REQUEST,
        message: HttpMessage.INVALID_ID,
      });
    }
  }

  private async isProductExist(id: string): Promise<boolean> {
    this.isValidPrismaId(id);

    const product = await this.findById(id);

    if (!product) {
      throw new HttpError({
        status: HttpCode.BAD_REQUEST,
        message: HttpMessage.PRODUCT_DOES_NOT_EXIST,
      });
    }

    return true;
  }

  public async top(): Promise<TopCategory[]> {
    const topCategories: Subcategory[] = [
      'JACKETS',
      'SWEATERS',
      'OVERSHIRTS',
      'QUILTED',
    ];
    const IMAGE_POSITION = 6;
    const tops: TopCategory[] = [];

    for (const subcategory of topCategories) {
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
          tops.push({ id: buildId(title), name: subcategory, url: imageUrl });
        }
      }
    }

    return tops;
  }
}

export { ProductsService };
