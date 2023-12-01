import { ApiPath } from '~/libs/enums/enums.js';
import {
  type ApiHandlerOptions,
  type ApiHandlerResponse,
  Controller,
} from '~/libs/packages/controller/controller.js';
import { HttpCode } from '~/libs/packages/http/http.js';
import { type ILogger } from '~/libs/packages/logger/logger.js';

import { OrdersApiPath } from './libs/enums/enums.js';
import { type CreateOrderDTO } from './libs/types/types.js';
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
 *           example: "example@mail.ua"
 *
 *     OrderDelivery:
 *       type: object
 *       properties:
 *         address:
 *           type: string
 *           example: "First avenue"
 *         moreInfo:
 *           type: string
 *           example: "I need help"
 *         zipCode:
 *           type: string
 *           example: "52001"
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
 */
class OrdersController extends Controller {
  private ordersService: OrdersService;

  public constructor(logger: ILogger, ordersService: OrdersService) {
    super(logger, ApiPath.ORDERS);

    this.ordersService = ordersService;

    this.addRoute({
      path: OrdersApiPath.ROOT,
      method: 'POST',
      validation: {},
      handler: (options) =>
        this.createOrder(
          options as ApiHandlerOptions<{ body: CreateOrderDTO }>,
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
}

export { OrdersController };
