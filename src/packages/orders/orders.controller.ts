import { ApiPath } from '~/libs/enums/enums.js';
import {
  type ApiHandlerOptions,
  type ApiHandlerResponse,
  Controller,
} from '~/libs/packages/controller/controller.js';
import { HttpCode } from '~/libs/packages/http/http.js';
import { type ILogger } from '~/libs/packages/logger/logger.js';

import { OrdersApiPath } from './libs/enums/enums.js';
import {
  type CreateOrderDTO,
  type UpdateOrderDTO,
} from './libs/types/types.js';
import {
  createOrderSchema,
  ordersParametersSchema,
  updateOrderSchema,
} from './libs/validations/validations.js';
import { type OrdersService } from './orders.service.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           example: "John"
 *         lastName:
 *           type: string
 *           example: "Doe"
 *         phone:
 *           type: string
 *           example: "+380111111111"
 *         email:
 *           type: string
 *           example: "john@gmail.com"
 *
 *     OrderDelivery:
 *       type: object
 *       properties:
 *         address:
 *           type: string
 *           example: "132, My Street"
 *         moreInfo:
 *           type: string
 *           example: "Additional information (optional)"
 *         zipCode:
 *           type: string
 *           example: "12401"
 *         city:
 *           type: string
 *           example: "Kyiv"
 *         state:
 *           type: string
 *           example: "Kyiv region"
 *         country:
 *           type: string
 *           example: "Ukraine"
 *
 *     OrderItem:
 *       type: object
 *       properties:
 *         productId:
 *           type: string
 *         quantity:
 *           type: integer
 *           example: 2
 *
 *     CreateOrderDTO:
 *       type: object
 *       properties:
 *         user:
 *           $ref: '#components/schemas/User'
 *         orderDelivery:
 *           $ref: '#components/schemas/OrderDelivery'
 *         orderItems:
 *           type: array
 *           items:
 *             $ref: '#components/schemas/OrderItem'
 *
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *         totalPrice:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
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
 *     OrderDoesNotExist:
 *       allOf:
 *         - $ref: '#/components/schemas/ErrorType'
 *         - type: object
 *           properties:
 *             message:
 *               type: string
 *               enum:
 *                 - Order with such id does not exist!
 *
 */
class OrdersController extends Controller {
  private ordersService: OrdersService;

  public constructor(logger: ILogger, ordersService: OrdersService) {
    super(logger, ApiPath.ORDERS);

    this.ordersService = ordersService;

    this.addRoute({
      path: OrdersApiPath.ROOT,
      method: 'POST',
      validation: {
        body: createOrderSchema,
      },
      handler: (options) =>
        this.createOrder(
          options as ApiHandlerOptions<{ body: CreateOrderDTO }>,
        ),
    });

    this.addRoute({
      path: OrdersApiPath.$ID,
      method: 'GET',
      validation: { params: ordersParametersSchema },
      handler: (options) =>
        this.findById(
          options as ApiHandlerOptions<{
            params: { id: string };
          }>,
        ),
    });

    this.addRoute({
      path: OrdersApiPath.$ID,
      method: 'DELETE',
      validation: { params: ordersParametersSchema },
      handler: (options) =>
        this.delete(
          options as ApiHandlerOptions<{
            params: { id: string };
          }>,
        ),
    });

    this.addRoute({
      path: OrdersApiPath.$ID,
      method: 'PUT',
      validation: {
        params: ordersParametersSchema,
        body: updateOrderSchema,
      },
      handler: (options) =>
        this.updateOrder(
          options as ApiHandlerOptions<{
            params: { id: string };
            body: Partial<UpdateOrderDTO>;
          }>,
        ),
    });
  }

  /**
   * Creates a new order.
   * @swagger
   * /orders/:
   *   post:
   *     tags:
   *       - Orders API
   *     summary: Create a new order.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateOrderDTO'
   *     responses:
   *       201:
   *         description: Order created successfully.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Order'
   */
  private async createOrder(
    options: ApiHandlerOptions<{ body: CreateOrderDTO }>,
  ): Promise<ApiHandlerResponse> {
    const order = await this.ordersService.create(options.body);

    return {
      status: HttpCode.CREATED,
      payload: order,
    };
  }

  /**
   * @swagger
   * /orders/{id}:
   *   get:
   *     tags:
   *       - Orders API
   *     summary: Find order by ID
   *     description: Retrieve an order by providing its ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the order to be retrieved
   *         schema:
   *           type: string
   *     responses:
   *       '200':
   *         description: Successful order retrieval.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Order'
   *       '400':
   *         description: Bad Request.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/OrderDoesNotExist'
   */
  private async findById(
    options: ApiHandlerOptions<{ params: { id: string } }>,
  ): Promise<ApiHandlerResponse> {
    const { id } = options.params;
    const order = await this.ordersService.findById(id);

    return {
      status: HttpCode.OK,
      payload: order,
    };
  }

  /**
   * Creates a new order.
   * @swagger
   * /orders/{id}:
   *   put:
   *     tags:
   *       - Orders API
   *     summary: Update an existing order.
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the order to be updated
   *         schema:
   *           type: string
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateOrderDTO'
   *     responses:
   *       200:
   *         description: Order updated successfully.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Order'
   */
  private async updateOrder(
    options: ApiHandlerOptions<{
      params: { id: string };
      body: UpdateOrderDTO;
    }>,
  ): Promise<ApiHandlerResponse> {
    const { params, body } = options;
    const order = await this.ordersService.update(params.id, body);

    return {
      status: HttpCode.OK,
      payload: order,
    };
  }

  /**
   * @swagger
   * /orders/{id}:
   *   delete:
   *     tags:
   *       - Orders API
   *     summary: Delete order by ID
   *     description: Delete an existing order by providing its ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the order to be deleted
   *         schema:
   *           type: string
   *     responses:
   *       '204':
   *         description: Order deleted successfully.
   *       '404':
   *         description: Order not found.
   */
  private async delete(
    options: ApiHandlerOptions<{ params: { id: string } }>,
  ): Promise<ApiHandlerResponse> {
    const { id } = options.params;
    const status = await this.ordersService.delete(id);

    return {
      status: HttpCode.NO_CONTENT,
      payload: status,
    };
  }
}

export { OrdersController };
