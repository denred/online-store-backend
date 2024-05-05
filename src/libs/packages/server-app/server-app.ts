import { type FastifyInstance } from 'fastify';

import { authController } from '~/packages/auth/auth.js';
import { filesController } from '~/packages/files/files.js';
import { ordersController } from '~/packages/orders/orders.js';
import { productsController } from '~/packages/products/products.js';
import { subscribersController } from '~/packages/subscribers/subscribers.js';
import { usersService } from '~/packages/users/users.js';
import { paymentsController } from '~/packages/payments/payments.js';

import { config } from '../config/config.js';
import { database } from '../database/database.js';
import { logger } from '../logger/logger.js';
import { jwtService } from '../packages.js';
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
      ...subscribersController.routes,
      ...ordersController.routes,
      ...authController.routes,
      ...paymentsController.routes,
    );

    server = new ServerApp({
      config,
      logger,
      database,
      apis: [apiV1],
      usersService,
      jwtService,
    });
    await server.init();
  }

  return server.getFastify();
}

export { initServer as serverInitializer };
export { type RouteParameters } from './types/types.js';
