import { config } from '../config/config.js';
import { database } from '../database/database.js';
import { logger } from '../logger/logger.js';
import { ServerApp } from './server-app.package.js';

const server = new ServerApp({ config, logger, database, apis: [] });

export { server };
export { type RouteParameters } from './types/types.js';
