import { type Product } from '@prisma/client';

import { ApiPath } from '~/libs/enums/enums.js';
import {
  type ApiHandlerOptions,
  type ApiHandlerResponse,
  Controller,
} from '~/libs/packages/controller/controller.js';
import { HttpCode } from '~/libs/packages/http/enums/enums.js';
import { type ILogger } from '~/libs/packages/logger/interfaces/interfaces.js';
import { type PaginatedQuery } from '~/libs/types/types.js';
import { commonGetPageQuery } from '~/libs/validations/validations.js';

import { AuthStrategy } from '../auth/auth.js';
import { ProductsApiPath } from './libs/enums/enums.js';
import { type CreateProductDto } from './libs/types/create-product-dto.type.js';
import {
  type GetFilteredProductRequestDto,
  type ImageUrl,
} from './libs/types/types.js';
import {
  createProductSchema,
  getSortedAndFilteredProductsSchema,
  productParametersSchema,
  productQuantitySchema,
  updateProductSchema,
} from './libs/validations/validations.js';
import { type ProductsService } from './products.service.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         vendorCode:
 *           type: number
 *         category:
 *           $ref: '#/components/schemas/Category'
 *         subcategory:
 *           $ref: '#/components/schemas/Subcategory'
 *         title:
 *           type: string
 *         colour:
 *           $ref: '#/components/schemas/Colour'
 *         description:
 *           type: string
 *         composition:
 *           type: string
 *         size:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Size'
 *         price:
 *           type: number
 *           example: 199.9
 *         brand:
 *           type: string
 *         collection:
 *           type: string
 *         manufacturer:
 *           type: string
 *         quantity:
 *           type: integer
 *         files:
 *           type: array
 *           items:
 *             type: string
 *             format: binary
 *             example: "id"
 *
 *     GetProductsResponseDto:
 *       type: object
 *       properties:
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 *         pages:
 *           type: number
 *           example: 30
 *
 *     GetFilteredProductRequestDto:
 *       type: object
 *       properties:
 *         colours:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Colour'
 *         sizes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Size'
 *         priceRange:
 *           type: object
 *           properties:
 *             min:
 *               type: number
 *               example: 0
 *             max:
 *               type: number
 *               example: 100
 *
 *     CreateProductBody:
 *       type: object
 *       properties:
 *         category:
 *           $ref: '#/components/schemas/Category'
 *         subcategory:
 *           $ref: '#/components/schemas/Subcategory'
 *         title:
 *           type: string
 *           example: 'Suede-effect bomber jacket'
 *         vendorCode:
 *           type: number
 *           example: '100001b'
 *         colour:
 *           $ref: '#/components/schemas/Colour'
 *         description:
 *           type: string
 *           example: 'Bomber design. Faux suede. Front zip closure. Long sleeve with elastic cuffs...'
 *         composition:
 *           type: string
 *           example: '60% polyester, 40% recycled polyester. Lining: 100% polyester...'
 *         size:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Size'
 *           example: ['XS', 'S', 'M', 'L', 'XL']
 *         price:
 *           type: number
 *           example: 199.9
 *         brand:
 *           type: string
 *           example: Mango
 *         manufacturer:
 *           type: string
 *           example: Bangladesh
 *         quantity:
 *           type: integer
 *           example: 5
 *         files:
 *           type: array
 *           items:
 *             type: string
 *             format: binary
 *             description: image id
 *             example: '655ce5fde572c6437cdd3059'
 *
 *     Review:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         text:
 *           type: string
 *         rating:
 *           type: number
 *         productId:
 *           type: string
 *
 *     SortedParams:
 *       type: string
 *       enum:
 *         - price-asc
 *         - price-desc
 *
 *     Size:
 *       type: string
 *       enum:
 *         - XS
 *         - S
 *         - M
 *         - L
 *         - XL
 *         - XXL
 *
 *     Category:
 *       type: string
 *       enum:
 *         - CLOTHING
 *
 *     Subcategory:
 *       type: string
 *       enum:
 *         - JACKETS
 *         - COATS
 *         - TRENCH
 *         - GILETS
 *         - OVERSHIRTS
 *         - SWEATERS
 *         - CARDIGANS
 *         - QUILTED
 *
 *     Colour:
 *       type: string
 *       enum:
 *         - BEIGE
 *         - BLACK
 *
 *     File:
 *       type: object
 *       properties:
 *         filename:
 *           type: string
 *           example: image.jpg
 *         content:
 *           type: string
 *           description: Valid MIME type
 *           example: image/png
 *
 *     ErrorType:
 *       type: object
 *       properties:
 *         errorType:
 *           type: string
 *           example: COMMON
 *           enum:
 *             - COMMON
 *             - VALIDATION
 *
 *     FileDoesNotExist:
 *       allOf:
 *         - $ref: '#/components/schemas/ErrorType'
 *         - type: object
 *           properties:
 *             message:
 *               type: string
 *               enum:
 *                 - File does not exist!
 *
 *     ProductValidationError:
 *       allOf:
 *         - $ref: '#/components/schemas/ErrorType'
 *         - type: object
 *           properties:
 *             message:
 *               type: string
 *               enum:
 *                 - 'Product is not valid!'
 *
 *     ProductNotFoundError:
 *       allOf:
 *         - $ref: '#/components/schemas/ErrorType'
 *         - type: object
 *           properties:
 *             message:
 *               type: string
 *               enum:
 *                 - Product with such id does not exist!
 *
 *     ProductInvalidIdError:
 *       allOf:
 *         - $ref: '#/components/schemas/ErrorType'
 *         - type: object
 *           properties:
 *             message:
 *               type: string
 *               enum:
 *                 - Products id is not valid!
 *
 *     TopCategory:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: basic_denim_jacket
 *         name:
 *           $ref: '#/components/schemas/Subcategory'
 *         url:
 *           type: string
 *           example: 'https://imgbucketonline.s3.eu-north-1.amazonaws.com//4963b077-b3ac-4ab0-a027-ec9a23bab23d?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA6AT3X3LBYHSX3HMJ%2F20231128%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20231128T072832Z&X-Amz-Expires=3600&X-Amz-Signature=fbb0eccc5dbec7c08513ebc8103a5d6b3b24ff1c108ac594bbecca54dcd7eb11&X-Amz-SignedHeaders=host&x-id=GetObject'
 *
 *
 *     ImageURL:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         url:
 *           type: string
 * securitySchemes:
 *   bearerAuth:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT
 *
 */
class ProductsController extends Controller {
  private productsService: ProductsService;

  public constructor(logger: ILogger, productsService: ProductsService) {
    super(logger, ApiPath.PRODUCTS);
    this.productsService = productsService;
    const defaultStrategy = [
      AuthStrategy.VERIFY_JWT,
      AuthStrategy.VERIFY_ADMIN,
    ];

    this.addRoute({
      path: ProductsApiPath.ROOT,
      method: 'POST',
      authStrategy: defaultStrategy,
      validation: {
        body: createProductSchema,
      },
      handler: (options) =>
        this.create(options as ApiHandlerOptions<{ body: CreateProductDto }>),
    });

    this.addRoute({
      path: ProductsApiPath.ROOT,
      method: 'GET',
      validation: {
        query: commonGetPageQuery,
      },
      handler: (options) =>
        this.findAll(options as ApiHandlerOptions<{ query: PaginatedQuery }>),
    });

    this.addRoute({
      path: ProductsApiPath.$ID,
      method: 'GET',
      validation: {
        params: productParametersSchema,
      },
      handler: (options) =>
        this.findById(
          options as ApiHandlerOptions<{
            params: { id: string };
          }>,
        ),
    });

    this.addRoute({
      path: ProductsApiPath.$ID,
      method: 'PUT',
      authStrategy: defaultStrategy,
      validation: {
        params: productParametersSchema,
        body: updateProductSchema,
      },
      handler: (options) =>
        this.update(
          options as ApiHandlerOptions<{
            params: { id: string };
            body: Partial<Product>;
          }>,
        ),
    });

    this.addRoute({
      path: ProductsApiPath.$ID,
      method: 'DELETE',
      authStrategy: defaultStrategy,
      validation: {
        params: productParametersSchema,
        query: commonGetPageQuery,
      },
      handler: (options) =>
        this.delete(options as ApiHandlerOptions<{ params: { id: string } }>),
    });

    this.addRoute({
      path: ProductsApiPath.SEARCH,
      method: 'POST',
      validation: {
        body: updateProductSchema,
        query: commonGetPageQuery,
      },
      handler: (options) =>
        this.search(
          options as ApiHandlerOptions<{
            body: Partial<Product>;
            query: PaginatedQuery;
          }>,
        ),
    });

    this.addRoute({
      path: ProductsApiPath.TOP,
      method: 'GET',
      handler: () => this.getTopCategories(),
    });

    this.addRoute({
      path: ProductsApiPath.IMAGES,
      method: 'GET',
      validation: {
        params: productParametersSchema,
      },
      handler: (options) =>
        this.getImages(
          options as ApiHandlerOptions<{ params: { id: string } }>,
        ),
    });

    this.addRoute({
      path: ProductsApiPath.NEW,
      method: 'GET',
      handler: () => this.getNewProducts(),
    });

    this.addRoute({
      path: ProductsApiPath.FILTER,
      method: 'POST',
      validation: {
        body: getSortedAndFilteredProductsSchema,
        query: commonGetPageQuery,
      },
      handler: (options) =>
        this.getSortedAndFilteredProducts(
          options as ApiHandlerOptions<{
            body: GetFilteredProductRequestDto;
            query: PaginatedQuery;
          }>,
        ),
    });

    this.addRoute({
      path: ProductsApiPath.UPDATE_QUANTITY,
      method: 'PUT',
      authStrategy: defaultStrategy,
      validation: {
        params: productParametersSchema,
        body: productQuantitySchema,
      },
      handler: (options) =>
        this.updateQuantity(
          options as ApiHandlerOptions<{
            params: { id: string };
            body: { quantity: number };
          }>,
        ),
    });
  }

  /**
   * @swagger
   * /products/:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Products API
   *     summary: Create product
   *     description: Add a new product to the store
   *     operationId: create
   *     requestBody:
   *       description: Add a new product to the store
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateProductBody'
   *     responses:
   *       201:
   *         description: Successful product creation.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Product'
   *       422:
   *         description: Unprocessable Entity
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ProductValidationError'
   *       400:
   *         description: Bad Request
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/FileDoesNotExist'
   */
  private async create(
    options: ApiHandlerOptions<{
      body: CreateProductDto;
    }>,
  ): Promise<ApiHandlerResponse> {
    const cratedProduct = await this.productsService.create(options.body);

    return {
      status: HttpCode.CREATED,
      payload: cratedProduct,
    };
  }

  /**
   * @swagger
   * /products/:
   *   get:
   *     tags:
   *       - Products API
   *     summary: Find all products
   *     description: Find all products
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Page number
   *       - in: query
   *         name: size
   *         schema:
   *           type: integer
   *           default: 10
   *         description: Number of items per page
   *     responses:
   *       200:
   *         description: Find operation had no errors.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GetProductsResponseDto'
   */
  private async findAll(
    options: ApiHandlerOptions<{ query: PaginatedQuery }>,
  ): Promise<ApiHandlerResponse> {
    const products = await this.productsService.findAll(options.query);

    return {
      status: HttpCode.OK,
      payload: products,
    };
  }

  /**
   * @swagger
   * /products/{id}:
   *   get:
   *     tags:
   *       - Products API
   *     summary: Find product by ID
   *     description: Retrieve a product by providing its ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the product to be retrieved
   *         schema:
   *           type: string
   *     responses:
   *       '200':
   *         description: Successful product retrieval.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Product'
   *       '400':
   *         description: Bad Request.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ProductInvalidIdError'
   */
  private async findById(
    options: ApiHandlerOptions<{ params: { id: string } }>,
  ): Promise<ApiHandlerResponse> {
    const { id } = options.params;
    const product = await this.productsService.findById(id);

    return {
      status: HttpCode.OK,
      payload: product,
    };
  }

  /**
   * @swagger
   * /products/{id}:
   *   put:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Products API
   *     summary: Update product by ID
   *     description: Update an existing product by providing its ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the product to be updated
   *         schema:
   *           type: string
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateProductBody'
   *     responses:
   *       '200':
   *         description: Successful product update.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Product'
   *       404:
   *         description: Product not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ProductNotFoundError'
   *
   *       422:
   *         description: Unprocessable Entity
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ProductValidationError'
   *
   *       400:
   *         description: Bad Request.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ProductInvalidIdError'
   *
   */
  private async update(
    options: ApiHandlerOptions<{
      params: { id: string };
      body: Partial<Product>;
    }>,
  ): Promise<ApiHandlerResponse> {
    const { params, body } = options;
    const updatedProduct = await this.productsService.update(params.id, body);

    return {
      status: HttpCode.OK,
      payload: { result: updatedProduct },
    };
  }

  /**
   * @swagger
   * /products/{id}:
   *   delete:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Products API
   *     summary: Delete product by ID
   *     description: Delete an existing product by providing its ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the product to be deleted
   *         schema:
   *           type: string
   *     responses:
   *       '204':
   *         description: Product deleted successfully.
   *       404:
   *         description: Product not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ProductNotFoundError'
   */
  private async delete(
    options: ApiHandlerOptions<{ params: { id: string } }>,
  ): Promise<ApiHandlerResponse> {
    const { id } = options.params;

    const status = await this.productsService.delete(id);

    return {
      status: HttpCode.NO_CONTENT,
      payload: { result: status },
    };
  }

  /**
   * @swagger
   * /products/search:
   *   post:
   *     tags:
   *       - Products API
   *     summary: Search products by field value
   *     description: Search products by field value
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Page number
   *       - in: query
   *         name: size
   *         schema:
   *           type: integer
   *           default: 10
   *         description: Number of items per page
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateProductBody'
   *     responses:
   *       200:
   *         description: Successful products search.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GetProductsResponseDto'
   *       422:
   *         description: Unprocessable Entity
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ProductValidationError'
   *       400:
   *         description: Bad Request
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/FileDoesNotExist'
   */
  private async search(
    options: ApiHandlerOptions<{
      body: Partial<Product>;
      query: PaginatedQuery;
    }>,
  ): Promise<ApiHandlerResponse> {
    const { body, query } = options;
    const searchedProducts = await this.productsService.search(body, query);

    return {
      status: HttpCode.OK,
      payload: searchedProducts,
    };
  }

  /**
   * @swagger
   * /products/top:
   *   get:
   *     tags:
   *       - Products API
   *     summary: Get top categories
   *     description: Get top categories
   *     responses:
   *       200:
   *         description: Find operation had no errors.
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/TopCategory'
   */
  private async getTopCategories(): Promise<ApiHandlerResponse> {
    const topCategories = await this.productsService.getTopCategories();

    return {
      status: HttpCode.OK,
      payload: topCategories,
    };
  }

  /**
   * @swagger
   * /products/images/{id}:
   *   get:
   *     tags:
   *       - Products API
   *     summary: Get Image URLs by Product ID
   *     description: Get Image URLs by Product ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the product to be retrieved
   *         schema:
   *           type: string
   *     responses:
   *       '200':
   *         description: Successful images retrieval.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ImageURL'
   *       '400':
   *         description: Bad Request.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/FileDoesNotExist'
   */
  private async getImages(
    options: ApiHandlerOptions<{ params: { id: string } }>,
  ): Promise<ApiHandlerResponse> {
    const { id } = options.params;

    const images: ImageUrl[] = await this.productsService.getImages(id);

    return {
      status: HttpCode.OK,
      payload: images,
    };
  }

  /**
   * @swagger
   * /products/new:
   *   get:
   *     tags:
   *       - Products API
   *     summary: Get new products
   *     description: Get new products
   *     responses:
   *       200:
   *         description: Find operation had no errors.
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Product'
   */
  private async getNewProducts(): Promise<ApiHandlerResponse> {
    const newProducts = await this.productsService.getNewProducts();

    return {
      status: HttpCode.OK,
      payload: newProducts,
    };
  }

  /**
   * @swagger
   * /products/filter:
   *   post:
   *     tags:
   *       - Products API
   *     summary: Filter products
   *     description: Filter products
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Page number
   *       - in: query
   *         name: size
   *         schema:
   *           type: integer
   *           default: 10
   *         description: Number of items per page
   *       - in: query
   *         name: sorting
   *         description: Sorting type
   *         schema:
   *           ref: '#/components/schemas/SortedParams'
   *           default: 'price-asc'
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/GetFilteredProductRequestDto'
   *     responses:
   *       200:
   *         description: Successful products filter.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GetProductsResponseDto'
   *       422:
   *         description: Unprocessable Entity
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ProductValidationError'
   *       400:
   *         description: Bad Request
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/FileDoesNotExist'
   */
  private async getSortedAndFilteredProducts(
    options: ApiHandlerOptions<{
      body: GetFilteredProductRequestDto;
      query: PaginatedQuery;
    }>,
  ): Promise<ApiHandlerResponse> {
    const { body, query } = options;
    const sortedAndFilteredProducts =
      await this.productsService.getSortedAndFilteredProducts(body, query);

    return {
      status: HttpCode.OK,
      payload: sortedAndFilteredProducts,
    };
  }

  /**
   * @swagger
   * /products/update-quantity/{id}:
   *   put:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Products API
   *     summary: Update product quantity by ID
   *     description: Update an existing product by providing its ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the product to be updated
   *         schema:
   *           type: string
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - quantity
   *             properties:
   *               quantity:
   *                 type: number
   *                 description: New quantity for the product
   *     responses:
   *       '200':
   *         description: Successful product update.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Product'
   *
   *       404:
   *         description: Product not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ProductNotFoundError'
   *
   *       422:
   *         description: Unprocessable Entity
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ProductValidationError'
   *
   *       400:
   *         description: Bad Request.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ProductInvalidIdError'
   *
   */
  private async updateQuantity(
    options: ApiHandlerOptions<{
      params: { id: string };
      body: { quantity: number };
    }>,
  ): Promise<ApiHandlerResponse> {
    const { id } = options.params;
    const { quantity } = options.body;
    const updatedProduct = await this.productsService.updateProductQuantity(
      id,
      quantity,
    );

    return {
      status: HttpCode.OK,
      payload: updatedProduct,
    };
  }
}

export { ProductsController };
