import { ApiPath } from '~/libs/enums/enums.js';
import {
  ApiHandlerOptions,
  ApiHandlerResponse,
  Controller,
  HttpCode,
  ILogger,
} from '~/libs/packages/packages.js';
import {
  type Payment,
  PaymentApiPath,
  paymentValidationSchema,
} from './libs/libs.js';
import { PaymentsService } from './payments.service.js';

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payments API
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       properties:
 *         cardNumber:
 *           type: string
 *           example: "4242424242424242"
 *           required: true
 *           minLength: 16
 *         cardHolder:
 *           type: string
 *           example: "John Doe"
 *           required: true
 *         month:
 *           type: number
 *           example: 1
 *           required: true
 *           minimum: 1
 *           maximum: 12
 *         year:
 *           type: number
 *           example: 2026
 *           required: true
 *         cvv:
 *           type: number
 *           example: 123
 *           required: true
 *           minimum: 100
 *           maximum: 999
 *         orderId:
 *           type: string
 *           example: "d7d9b6a0-7f8c-4e53-9e7a-5c9b9d9e9d9d"
 *
 *     PaymentResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "d7d9b6a0-7f8c-4e53-9e7a-5c9b9d9e9d9d"
 *         status:
 *           type: string
 *           example: "SUCCESS"
 *           enum:
 *             - SUCCESS
 *             - REJECTED
 *
 *     PaymentNotFoundError:
 *       type: object
 *       allOf:
 *         - $ref: '#/components/schemas/ErrorType'
 *         - type: object
 *           properties:
 *             message:
 *               type: string
 *               enum:
 *                 - Payment with such id does not exist!
 *
 *
 */
class PaymentsController extends Controller {
  private paymentsService: PaymentsService;

  public constructor(logger: ILogger, paymentsService: PaymentsService) {
    super(logger, ApiPath.PAYMENTS);

    this.paymentsService = paymentsService;

    this.addRoute({
      path: PaymentApiPath.CHECKOUT,
      method: 'POST',
      validation: {
        body: paymentValidationSchema,
      },
      handler: (options) =>
        this.savePayment(options as ApiHandlerOptions<{ body: Payment }>),
    });
  }

  /**
   * Payment checkout
   *
   * @swagger
   * /payments/checkout/:
   *   post:
   *     summary: Checkout
   *     tags: [Payments]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Payment'
   *     responses:
   *       '200':
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/PaymentResponse'
   *       '422':
   *         description: Unprocessed Entity
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ValidationError'
   *
   *       '404':
   *         description: Not Found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/PaymentNotFoundError'
   *
   */
  public async savePayment(
    options: ApiHandlerOptions<{
      body: Payment;
    }>,
  ): Promise<ApiHandlerResponse> {
    const { body } = options;
    const response = await this.paymentsService.savePayment(body);

    return {
      status: HttpCode.OK,
      payload: response,
    };
  }
}

export { PaymentsController };
