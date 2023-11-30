import { database } from '~/libs/packages/database/database.js';
import { logger } from '~/libs/packages/logger/logger.js';

import { SubscribersController } from './subscribers.controller.js';
import { SubscribersRepository } from './subscribers.repository.js';
import { SubscribersService } from './subscribers.service.js';

const subscribersRepository = new SubscribersRepository(database);
const subscribersService = new SubscribersService(subscribersRepository);
const subscribersController = new SubscribersController(
  logger,
  subscribersService,
);

export { subscribersController };
