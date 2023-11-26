import { type FastifyInstance } from 'fastify';

import { filesController } from '~/packages/files/files.js';
import { productsController } from '~/packages/products/products.js';

import { config } from '../config/config.js';
import { database } from '../database/database.js';
import { logger } from '../logger/logger.js';
import { ServerApp } from './server-app.package.js';
import { ServerAppApi } from './server-app-api.package.js';

let server: ServerApp;

async function initServer(): Promise<FastifyInstance> {
  if (!server) {
    const apiV1 = new ServerAppApi(
      'v1',
      config,
      ...productsController.routes,
      ...filesController.routes,
    );

    server = new ServerApp({ config, logger, database, apis: [apiV1] });
    await server.init();
  }

  return server.getFastify();
}

export { initServer as serverInitializer };
export { type RouteParameters } from './types/types.js';
