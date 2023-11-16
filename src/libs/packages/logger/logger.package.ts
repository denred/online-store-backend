import pino from 'pino';
import { type Logger as TLogger } from 'pino';
import pretty from 'pino-pretty';

import { type ILogger } from './interfaces/logger.interface.js';

class Logger implements ILogger {
  private readonly logger: TLogger;

  public constructor() {
    this.logger = pino(pretty());
    this.logger.info('Logger is created…');
  }

  public info(
    message: string,
    parameters: Record<string, unknown> = {},
  ): ReturnType<ILogger['info']> {
    this.logger.info(parameters, message);
  }

  public warn(
    message: string,
    parameters: Record<string, unknown> = {},
  ): ReturnType<ILogger['warn']> {
    this.logger.warn(parameters, message);
  }

  public error(
    message: string,
    parameters: Record<string, unknown> = {},
  ): ReturnType<ILogger['error']> {
    this.logger.error(parameters, message);
  }

  public debug(
    message: string,
    parameters: Record<string, unknown> = {},
  ): ReturnType<ILogger['debug']> {
    this.logger.debug(parameters, message);
  }
}

export { Logger };
