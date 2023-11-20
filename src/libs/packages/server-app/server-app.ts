import { productsController } from '~/packages/products/products.js';

import { config } from '../config/config.js';
import { database } from '../database/database.js';
import { logger } from '../logger/logger.js';
import { ServerApp } from './server-app.package.js';
import { ServerAppApi } from './server-app-api.package.js';

const apiV1 = new ServerAppApi('v1', config, ...productsController.routes);

const server = new ServerApp({ config, logger, database, apis: [apiV1] });

export { server };
export { type RouteParameters } from './types/types.js';
