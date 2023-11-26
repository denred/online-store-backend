import swaggerJSDoc from 'swagger-jsdoc';

import { AppEnvironment } from '~/libs/enums/enums.js';

import { type IConfig } from '../config/config.js';
import { type EnvironmentSchema } from '../config/types/environment-schema.type.js';
import { type IServerAppApi } from './interfaces/server-app-api.interface.js';
import { type RouteParameters } from './types/route-parameters.type.js';

class ServerAppApi implements IServerAppApi {
  public version: string;

  public routes: RouteParameters[];

  private config: IConfig<EnvironmentSchema>;

  public constructor(
    version: string,
    config: IConfig<EnvironmentSchema>,
    ...handlers: RouteParameters[]
  ) {
    this.version = version;
    this.config = config;
    this.routes = handlers.map((it) => ({
      ...it,
      path: this.buildFullPath(it.path),
    }));
  }

  public buildFullPath(path: string): string {
    return `/api/${this.version}${path}`;
  }

  public generateDoc(): ReturnType<typeof swaggerJSDoc> {
    const isProduction =
      this.config.ENV.APP.ENVIRONMENT === AppEnvironment.PRODUCTION;

    const isDevelopment =
      this.config.ENV.APP.ENVIRONMENT === AppEnvironment.DEVELOPMENT;

    const controllerExtension = isProduction || isDevelopment ? 'js' : 'ts';
    const sourceDirectory = isDevelopment ? 'build' : 'src';

    const options: swaggerJSDoc.OAS3Options = {
      definition: {
        openapi: '3.0.3',
        info: {
          title: 'Online-store API',
          version: `${this.version}.0.0`,
        },
        servers: [
          {
            url: `/api/${this.version}`,
          },
        ],
      },
      apis: [
        `${sourceDirectory}/packages/**/*.controller.${controllerExtension}`,
      ],
    };

    return swaggerJSDoc(options);
  }
}

export { ServerAppApi };
