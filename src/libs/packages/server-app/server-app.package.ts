import fastifyAuth from '@fastify/auth';
import cors from '@fastify/cors';
import swagger, { type StaticDocumentSpec } from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { type PrismaClient } from '@prisma/client';
import Fastify, {
  type FastifyError,
  type FastifySchema,
  type onRequestHookHandler,
  type preHandlerHookHandler,
  type preValidationHookHandler,
} from 'fastify';
import { type Schema as ValidationSchema, type ValidationError } from 'joi';

import { ServerErrorType } from '~/libs/enums/enums.js';
import { HttpError } from '~/libs/exceptions/exceptions.js';
import {
  type ServerCommonErrorResponse,
  type ServerValidationErrorResponse,
} from '~/libs/types/types.js';

import { type IConfig } from '../config/config.js';
import { type EnvironmentSchema } from '../config/types/types.js';
import { HttpCode } from '../http/enums/enums.js';
import { type ILogger } from '../logger/logger.js';
import {
  type IServerApp,
  type IServerAppApi,
} from './interfaces/interfaces.js';
import { type RouteParameters } from './types/route-parameters.type.js';

type Constructor = {
  config: IConfig<EnvironmentSchema>;
  logger: ILogger;
  database: PrismaClient;
  apis: IServerAppApi[];
};

class ServerApp implements IServerApp {
  private config: IConfig<EnvironmentSchema>;

  private logger: ILogger;

  private database: PrismaClient;

  private apis: IServerAppApi[];

  private app: ReturnType<typeof Fastify>;

  public constructor({ config, logger, database, apis }: Constructor) {
    this.config = config;
    this.logger = logger;
    this.database = database;
    this.apis = apis;

    this.app = Fastify();
  }

  public addRoute(parameters: RouteParameters): void {
    const { path, method, handler, validation } = parameters;

    const onRequests: onRequestHookHandler[] = [];
    const preHandler: preHandlerHookHandler[] = [];
    const preValidations: preValidationHookHandler[] = [];

    const schema: FastifySchema = {};

    if (validation?.body) {
      schema.body = validation.body;
    }

    if (validation?.params) {
      schema.params = validation.params;
    }

    if (validation?.query) {
      schema.querystring = validation.query;
    }

    this.app.route({
      url: path,
      method,
      handler,
      onRequest: onRequests,
      preHandler,
      preValidation: preValidations,
      schema,
    });

    this.logger.info(`Route: ${method as string} ${path} is registered`);
  }

  public addRoutes(parameters: RouteParameters[]): void {
    for (const it of parameters) {
      this.addRoute(it);
    }
  }

  public initRoutes(): void {
    const routers = this.apis.flatMap((it) => it.routes);

    this.addRoutes(routers);
  }

  public async initMiddlewares(): Promise<void> {
    await Promise.all(
      this.apis.map(async (it) => {
        this.logger.info(
          `Generate swagger documentation for API ${it.version}`,
        );

        await this.app.register(swagger, {
          mode: 'static',
          specification: {
            document: it.generateDoc() as StaticDocumentSpec['document'],
          },
        });

        await this.app.register(swaggerUi, {
          routePrefix: `${it.version}/documentation`,
        });

        await this.app.register(cors, {
          origin: '*',
          methods: 'GET,PUT,POST,DELETE',
          allowedHeaders: 'Content-Type',
        });
      }),
    );
  }

  private initValidationCompiler(): void {
    this.app.setValidatorCompiler<ValidationSchema>(({ schema }) => {
      return <T, R = ReturnType<ValidationSchema['validate']>>(data: T): R => {
        return schema.validate(data, {
          abortEarly: false,
        }) as R;
      };
    });
  }

  private initErrorHandler(): void {
    this.app.setErrorHandler(
      (error: FastifyError | ValidationError, _request, replay) => {
        if ('isJoi' in error) {
          this.logger.error(`[Validation Error]: ${error.message}`);

          for (const it of error.details) {
            this.logger.error(`[${it.path.toString()}] — ${it.message}`);
          }

          const response: ServerValidationErrorResponse = {
            errorType: ServerErrorType.VALIDATION,
            message: error.message,
            details: error.details.map((it) => ({
              path: it.path,
              message: it.message,
            })),
          };

          return replay.status(HttpCode.UNPROCESSED_ENTITY).send(response);
        }

        if (error instanceof HttpError) {
          this.logger.error(
            `[Http Error]: ${error.status.toString()} – ${error.message}`,
          );

          const response: ServerCommonErrorResponse = {
            errorType: ServerErrorType.COMMON,
            message: error.message,
          };

          return replay.status(error.status).send(response);
        }

        this.logger.error(error.message);

        const response: ServerCommonErrorResponse = {
          errorType: ServerErrorType.COMMON,
          message: error.message,
        };

        return replay.status(HttpCode.INTERNAL_SERVER_ERROR).send(response);
      },
    );
  }

  private async initPlugins(): Promise<void> {
    await this.app.register(fastifyAuth);
  }

  public async init(): Promise<void> {
    this.logger.info('Application initialization…');

    this.database;

    await this.initMiddlewares();

    await this.initPlugins();

    this.initValidationCompiler();

    this.initErrorHandler();

    this.initRoutes();

    await this.app
      .listen({
        port: this.config.ENV.APP.PORT,
      })
      .catch((error: Error) => {
        this.logger.error(error.message, {
          cause: error.cause,
          stack: error.stack,
        });
      });

    this.logger.info(
      `Application is listening on PORT – ${this.config.ENV.APP.PORT.toString()}, on ENVIRONMENT – ${
        this.config.ENV.APP.ENVIRONMENT as string
      }.`,
    );
  }
}

export { ServerApp };
