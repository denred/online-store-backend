import convict, { type Config as TConfig } from 'convict';
import { config } from 'dotenv';

import { AppEnvironment } from '~/libs/enums/enums.js';

import { type ILogger } from '../logger/logger.js';
import { type IConfig } from './interfaces/interfaces.js';
import { type EnvironmentSchema } from './types/types.js';

class Config implements IConfig<EnvironmentSchema> {
  private logger: ILogger;

  public ENV: EnvironmentSchema;

  public constructor(logger: ILogger) {
    this.logger = logger;

    config();

    this.envSchema.load({});
    this.envSchema.validate({
      allowed: 'strict',
      output: (message) => this.logger.info(message),
    });

    this.ENV = this.envSchema.getProperties();
    this.logger.info('.env file found and successfully parsed!');
  }

  private get envSchema(): TConfig<EnvironmentSchema> {
    return convict<EnvironmentSchema>({
      APP: {
        ENVIRONMENT: {
          doc: 'Application environment',
          format: Object.values(AppEnvironment),
          env: 'NODE_ENV',
          default: null,
        },
        PORT: {
          doc: 'Port for incoming connections',
          format: Number,
          env: 'PORT',
          default: null,
        },
      },
    });
  }
}

export { Config };
