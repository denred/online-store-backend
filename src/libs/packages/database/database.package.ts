import { PrismaClient } from '@prisma/client';

import { type ILogger, logger } from '../logger/logger.js';

class Database {
  private static instance: Database | null = null;

  private readonly client: PrismaClient;

  private logger: ILogger;

  private constructor(logger: ILogger) {
    this.client = new PrismaClient();
    this.logger = logger;
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database(logger);
    }

    return Database.instance;
  }

  public async getConnection(): Promise<PrismaClient> {
    await this.checkConnection();

    return this.client;
  }

  public async checkConnection(): Promise<void> {
    try {
      await this.client.$connect();
      this.logger.info('Connection to the database established.');
    } catch {
      this.logger.error('Error checking database connection.');
    }
  }
}

export { Database };
