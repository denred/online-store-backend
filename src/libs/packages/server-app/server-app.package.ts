import path from 'path';
import fastifyAuth, { type FastifyAuthFunction } from '@fastify/auth';
import cors from '@fastify/cors';
import fastifyMultipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import swagger, { type StaticDocumentSpec } from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { type PrismaClient } from '@prisma/client';
import Fastify, {
  type FastifyError,
  type FastifyInstance,
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
import { authPlugin } from '~/packages/auth/auth.js';
import { filesValidationPlugin } from '~/packages/files/files-validation.plugin.js';
import { type FileInputConfig } from '~/packages/files/libs/types/types.js';
import { type UsersService } from '~/packages/users/users.js';

import { type IConfig } from '../config/config.js';
import { type EnvironmentSchema } from '../config/types/types.js';
import { type AuthStrategyHandler } from '../controller/controller.js';
import { type ValidateFilesStrategyOptions } from '../controller/types/validate-files-strategy-options.type.js';
import { HttpCode } from '../http/enums/enums.js';
import { type ILogger } from '../logger/logger.js';
import { type IJwtService } from '../packages.js';
import { FileSizeBytes } from './enums/enums.js';
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
  usersService: UsersService;
  jwtService: IJwtService;
};

type StrategyFunction = (config?: FileInputConfig) => preHandlerHookHandler;

class ServerApp implements IServerApp {
  private config: IConfig<EnvironmentSchema>;

  private logger: ILogger;

  private database: PrismaClient;

  private apis: IServerAppApi[];

  private app: ReturnType<typeof Fastify>;

  private usersService: UsersService;

  private jwtService: IJwtService;

  public constructor({
    config,
    logger,
    database,
    apis,
    usersService,
    jwtService,
  }: Constructor) {
    this.config = config;
    this.logger = logger;
    this.database = database;
    this.apis = apis;
    this.usersService = usersService;
    this.jwtService = jwtService;
    this.app = Fastify();
  }

  public addRoute(parameters: RouteParameters): void {
    const {
      path,
      method,
      handler,
      validation,
      validateFilesStrategy,
      authStrategy,
    } = parameters;

    const onRequest: onRequestHookHandler[] = [];
    const preHandler: preHandlerHookHandler[] = [];
    const preValidation: preValidationHookHandler[] = [];

    if (authStrategy) {
      const authStrategyHandler = this.resolveAuthStrategy(authStrategy);

      if (authStrategyHandler) {
        onRequest.push(authStrategyHandler);
      }
    }

    if (validateFilesStrategy) {
      preValidation.push(
        this.resolveFileValidationStrategy(validateFilesStrategy),
      );
    }

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
      onRequest,
      preHandler,
      preValidation,
      schema,
    });

    this.logger.info(`Route: ${method as string} ${path} is registered`);
  }

  private resolveFileValidationStrategy(
    validateFilesStrategy: ValidateFilesStrategyOptions,
  ): preHandlerHookHandler {
    const { strategy, filesInputConfig } = validateFilesStrategy;

    if (!(strategy in this.app)) {
      throw new Error(`Invalid strategy: ${strategy}`);
    }

    const strategyFunction = this.app[strategy] as StrategyFunction;

    return strategyFunction(filesInputConfig);
  }

  private resolveAuthStrategy(
    authStrategy?: AuthStrategyHandler,
  ): undefined | preHandlerHookHandler {
    if (!authStrategy) {
      return undefined;
    }

    if (Array.isArray(authStrategy) && authStrategy.length > 0) {
      const strategies = authStrategy.map(
        (strategy) => this.app[strategy as keyof typeof this.app],
      );

      return this.app.auth(strategies as FastifyAuthFunction[], {
        relation: 'and',
      });
    }

    if (typeof authStrategy === 'string' && authStrategy in this.app) {
      return this.app.auth([
        this.app[authStrategy as keyof typeof this.app],
      ] as FastifyAuthFunction[]);
    }

    return undefined;
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

        await this.app.register(fastifyStatic, {
          root: path.join(path.resolve(), 'styles'),
          prefix: '/styles/',
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
    await this.app.register(authPlugin, {
      config: this.config,
      usersService: this.usersService,
      jwtService: this.jwtService,
    });

    await this.app.register(filesValidationPlugin);

    await this.app.register(fastifyMultipart, {
      attachFieldsToBody: true,
      limits: {
        fileSize: FileSizeBytes.TEN_MEGABYTES,
      },
    });
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
      `Application is listening on PORT - ${this.config.ENV.APP.PORT.toString()}, on ENVIRONMENT - ${
        this.config.ENV.APP.ENVIRONMENT as string
      }.`,
    );
  }

  public getFastify(): FastifyInstance {
    return this.app;
  }
}

export { ServerApp };
