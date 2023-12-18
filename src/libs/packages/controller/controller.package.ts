import { type MultipartParsedFile } from '~/packages/files/libs/types/multipart-parsed-file.type.js';

import { type ILogger } from '../logger/logger.js';
import { type RouteParameters } from '../server-app/server-app.js';
import { buildUrl } from './helpers/helpers.js';
import { type IController } from './interfaces/interfaces.js';
import {
  type ApiHandler,
  type ApiHandlerOptions,
  type ControllerRouteParameters,
  type DefaultStrategies,
} from './types/types.js';

class Controller implements IController {
  public routes: RouteParameters[];

  public defaultStrategies: DefaultStrategies;

  private logger: ILogger;

  private apiUrl: string;

  public constructor(
    logger: ILogger,
    apiPath: string,
    strategies?: DefaultStrategies,
  ) {
    this.logger = logger;
    this.apiUrl = apiPath;
    this.routes = [];
    this.defaultStrategies = strategies;
  }

  public addRoute(options: ControllerRouteParameters): void {
    const { handler, path } = options;

    this.routes.push({
      authStrategy: this.defaultStrategies,
      ...options,
      path: this.apiUrl + path,
      handler: (request, reply) => this.mapHandler(handler, request, reply),
    });
  }

  private async mapHandler(
    handler: ApiHandler,
    request: Parameters<RouteParameters['handler']>[0],
    reply: Parameters<RouteParameters['handler']>[1],
  ): Promise<void> {
    this.logger.info(`${request.method.toUpperCase()} on ${request.url}`);

    const handlerOptions = this.mapRequest(request);
    const { status, payload } = await handler(handlerOptions);

    return await reply.status(status).send(payload);
  }

  private mapRequest(
    request: Parameters<RouteParameters['handler']>[0],
  ): ApiHandlerOptions {
    const { body, query, params, hostname, protocol, user } = request;

    return {
      body,
      query,
      user,
      params,
      parsedFiles: (body as { files: MultipartParsedFile[] })?.files,
      hostname: buildUrl(protocol, hostname),
    };
  }
}

export { Controller };
