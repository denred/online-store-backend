import { ApiPath } from '~/libs/enums/enums.js';
import {
  type ApiHandlerOptions,
  type ApiHandlerResponse,
  Controller,
} from '~/libs/packages/controller/controller.js';
import { HttpCode } from '~/libs/packages/http/http.js';
import { type ILogger } from '~/libs/packages/logger/logger.js';

import { AuthStrategy } from '../auth/auth.js';
import { SubscribersApiPath } from './libs/enums/enums.js';
import { type SubscriptionBody } from './libs/types/types.js';
import { subscriptionBodyValidation } from './libs/validations/validations.js';
import { type SubscribersService } from './subscribers.service.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     Subscription:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The ID of the subscription
 *         email:
 *           type: string
 *           description: The email of the subscriber
 *         firstName:
 *           type: string
 *           description: The first name of the subscriber
 *         lastName:
 *           type: string
 *           description: The last name of the subscriber
 *
 *     SubscriptionBody:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: The email of the subscriber
 *           example: john@example.com
 *         firstName:
 *           type: string
 *           description: The first name of the subscriber
 *         lastName:
 *           type: string
 *           description: The last name of the subscriber
 *         preferences:
 *           type: object
 *           properties:
 *             receiveNewsletter:
 *               type: boolean
 *               description: Whether the subscriber wants to receive newsletters
 *             productUpdates:
 *               type: boolean
 *               description: Whether the subscriber wants to receive product updates
 *
 *     ApiResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           description: HTTP status code
 *         payload:
 *           type: any
 *           description: Response payload
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
 *     SubscriptionAlreadyExist:
 *       allOf:
 *         - $ref: '#/components/schemas/ErrorType'
 *         - type: object
 *           properties:
 *             message:
 *               type: string
 *               enum:
 *                 - Subscription with such id does not exist!
 *
 *     ValidationError:
 *       allOf:
 *         - $ref: '#/components/schemas/ErrorType'
 *         - type: object
 *           properties:
 *             message:
 *               type: string
 *               enum:
 *                 - Validation error!
 *
 *     SubscriptionNotFound:
 *       allOf:
 *         - $ref: '#/components/schemas/ErrorType'
 *         - type: object
 *           properties:
 *             message:
 *               type: string
 *               enum:
 *                 - Subscription not found.
 *
 *     Preferences:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The ID of the preferences
 *         receiveNewsletter:
 *           type: boolean
 *           description: Whether the subscriber wants to receive newsletters
 *         productUpdates:
 *           type: boolean
 *           description: Whether the subscriber wants to receive product updates
 *         subscriptionId:
 *           type: string
 *           description: The ID of the associated subscription
 */
class SubscribersController extends Controller {
  private subscribersService: SubscribersService;

  public constructor(logger: ILogger, subscribersService: SubscribersService) {
    super(logger, ApiPath.EMAILS);

    this.subscribersService = subscribersService;

    this.addRoute({
      path: SubscribersApiPath.SUBSCRIBE,
      method: 'POST',
      validation: {
        body: subscriptionBodyValidation,
      },
      handler: (options) =>
        this.subscribe(
          options as ApiHandlerOptions<{ body: SubscriptionBody }>,
        ),
    });

    this.addRoute({
      path: SubscribersApiPath.UNSUBSCRIBE,
      method: 'POST',
      authStrategy: AuthStrategy.VERIFY_JWT,
      validation: {
        body: subscriptionBodyValidation,
      },
      handler: (options) =>
        this.unsubscribe(
          options as ApiHandlerOptions<{ body: SubscriptionBody }>,
        ),
    });

    this.addRoute({
      path: SubscribersApiPath.SUBSCRIPTION_STATUS,
      method: 'POST',
      authStrategy: AuthStrategy.VERIFY_JWT,
      validation: {
        body: subscriptionBodyValidation,
      },
      handler: (options) =>
        this.getStatus(
          options as ApiHandlerOptions<{ body: SubscriptionBody }>,
        ),
    });

    this.addRoute({
      path: SubscribersApiPath.SUBSCRIPTION_PREFERENCES,
      method: 'PUT',
      authStrategy: AuthStrategy.VERIFY_JWT,
      validation: {
        body: subscriptionBodyValidation,
      },
      handler: (options) =>
        this.setPreferences(
          options as ApiHandlerOptions<{ body: SubscriptionBody }>,
        ),
    });
  }

  /**
   * @swagger
   * /emails/subscribe:
   *   post:
   *     tags:
   *       - Subscribers API
   *     summary: Subscribe a user
   *     description: Add email to the store for subscription
   *     operationId: create
   *     requestBody:
   *       description: Add email to the store for subscription
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/SubscriptionBody'
   *     responses:
   *       '200':
   *         description: Subscribe successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: boolean
   *       422:
   *         description: Unprocessable Entity
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ValidationError'
   *       400:
   *         description: Bad Request
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SubscriptionAlreadyExist'
   */
  private async subscribe(
    options: ApiHandlerOptions<{ body: SubscriptionBody }>,
  ): Promise<ApiHandlerResponse> {
    const actionStatus = await this.subscribersService.subscribe(options.body);

    return {
      status: HttpCode.OK,
      payload: actionStatus,
    };
  }

  /**
   * @swagger
   * /emails/unsubscribe:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Subscribers API
   *     summary: Unsubscribe a user
   *     description: Remove email from the store for subscription
   *     operationId: unsubscribe
   *     requestBody:
   *       description: Unsubscribe information
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/SubscriptionBody'
   *     responses:
   *       '200':
   *         description: Unsubscribe successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: boolean
   *       422:
   *         description: Unprocessable Entity
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ValidationError'
   */
  private async unsubscribe(
    options: ApiHandlerOptions<{ body: SubscriptionBody }>,
  ): Promise<ApiHandlerResponse> {
    const actionStatus = await this.subscribersService.unsubscribe(
      options.body,
    );

    return {
      status: HttpCode.OK,
      payload: actionStatus,
    };
  }

  /**
   * @swagger
   * /emails/subscription/status:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Subscribers API
   *     summary: Get subscription status
   *     description: Retrieve the subscription status for an email
   *     operationId: getStatus
   *     requestBody:
   *       description: Get status information
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/SubscriptionBody'
   *     responses:
   *       '200':
   *         description: Status retrieved successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: string
   *               enum:
   *                 - SUBSCRIBE
   *                 - UNSUBSCRIBE
   *       422:
   *         description: Unprocessable Entity
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ValidationError'
   */
  private async getStatus(
    options: ApiHandlerOptions<{ body: SubscriptionBody }>,
  ): Promise<ApiHandlerResponse> {
    const status = await this.subscribersService.getStatus(options.body);

    return {
      status: HttpCode.OK,
      payload: status,
    };
  }

  /**
   * @swagger
   * /emails/subscription/preferences:
   *   put:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Subscribers API
   *     summary: Set subscription preferences
   *     description: Update subscription preferences for an email
   *     operationId: setPreferences
   *     requestBody:
   *       description: Preferences information
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/SubscriptionBody'
   *     responses:
   *       '200':
   *         description: Preferences set successfully.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Preferences'
   *       422:
   *         description: Unprocessable Entity
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ValidationError'
   *       404:
   *         description: Not Found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SubscriptionNotFound'
   */
  private async setPreferences(
    options: ApiHandlerOptions<{ body: SubscriptionBody }>,
  ): Promise<ApiHandlerResponse> {
    const actionStatus = await this.subscribersService.setPreferences(
      options.body,
    );

    return {
      status: HttpCode.OK,
      payload: actionStatus,
    };
  }
}

export { SubscribersController };
