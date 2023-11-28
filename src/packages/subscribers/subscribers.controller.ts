import { ApiPath } from '~/libs/enums/enums.js';
import {
  type ApiHandlerOptions,
  type ApiHandlerResponse,
  Controller,
} from '~/libs/packages/controller/controller.js';
import { HttpCode } from '~/libs/packages/http/http.js';
import { type ILogger } from '~/libs/packages/logger/logger.js';

import { SubscribersApiPath } from './libs/enums/enums.js';
import { type SubscribeBody } from './libs/types/types.js';
import { subscribeBodyValidation } from './libs/validations/validations.js';
import { type SubscribersService } from './subscribers.service.js';

class Subscribers extends Controller {
  private subscribersService: SubscribersService;

  public constructor(logger: ILogger, subscribersService: SubscribersService) {
    super(logger, ApiPath.EMAILS);

    this.subscribersService = subscribersService;

    this.addRoute({
      path: SubscribersApiPath.SUBSCRIBE,
      method: 'POST',
      validation: {
        body: subscribeBodyValidation,
      },
      handler: (options) =>
        this.subscribe(options as ApiHandlerOptions<{ body: SubscribeBody }>),
    });

    this.addRoute({
      path: SubscribersApiPath.UNSUBSCRIBE,
      method: 'POST',
      validation: {
        body: subscribeBodyValidation,
      },
      handler: (options) =>
        this.unsubscribe(options as ApiHandlerOptions<{ body: SubscribeBody }>),
    });

    this.addRoute({
      path: SubscribersApiPath.SUBSCRIPTION_STATUS,
      method: 'POST',
      validation: {
        body: subscribeBodyValidation,
      },
      handler: (options) =>
        this.getStatus(options as ApiHandlerOptions<{ body: SubscribeBody }>),
    });

    this.addRoute({
      path: SubscribersApiPath.SUBSCRIPTION_PREFERENCES,
      method: 'PUT',
      validation: {
        body: subscribeBodyValidation,
      },
      handler: (options) =>
        this.setPreferences(
          options as ApiHandlerOptions<{ body: SubscribeBody }>,
        ),
    });
  }

  private async subscribe(
    options: ApiHandlerOptions<{ body: SubscribeBody }>,
  ): Promise<ApiHandlerResponse> {
    const actionStatus = await this.subscribersService.subscribe(options.body);

    return {
      status: HttpCode.OK,
      payload: actionStatus,
    };
  }

  private async unsubscribe(
    options: ApiHandlerOptions<{ body: SubscribeBody }>,
  ): Promise<ApiHandlerResponse> {
    const actionStatus = await this.subscribersService.unsubscribe(
      options.body,
    );

    return {
      status: HttpCode.OK,
      payload: actionStatus,
    };
  }

  private async getStatus(
    options: ApiHandlerOptions<{ body: SubscribeBody }>,
  ): Promise<ApiHandlerResponse> {
    const status = await this.subscribersService.getStatus(options.body);

    return {
      status: HttpCode.OK,
      payload: status,
    };
  }

  private async setPreferences(
    options: ApiHandlerOptions<{ body: SubscribeBody }>,
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

export { Subscribers };
