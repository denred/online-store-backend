import { database } from '~/libs/packages/database/database.js';
import { logger } from '~/libs/packages/logger/logger.js';

import { usersService } from '../users/users.js';
import { OrdersController } from './orders.controller.js';
import { OrdersRepository } from './orders.repository.js';
import { OrdersService } from './orders.service.js';

const ordersRepository = new OrdersRepository(database);
const ordersService = new OrdersService(ordersRepository, usersService);
const ordersController = new OrdersController(logger, ordersService);

export { ordersController };
