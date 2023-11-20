import { database } from '~/libs/packages/database/database.js';
import { logger } from '~/libs/packages/logger/logger.js';

import { ProductsController } from './products.controller.js';
import { ProductsRepository } from './products.repository.js';
import { ProductsService } from './products.service.js';

const productsRepository = new ProductsRepository(database);
const productsService = new ProductsService(productsRepository);
const productsController = new ProductsController(logger, productsService);

export { productsController };
