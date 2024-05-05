import { logger } from '~/libs/packages/logger/logger.js';
import { database } from '~/libs/packages/database/database.js';
import { PaymentsController } from './payments.controller.js';
import { PaymentsService } from './payments.service.js';
import { PaymentsRepository } from './payments.repository.js';

const paymentsRepository = new PaymentsRepository(database);
const paymentsService = new PaymentsService(paymentsRepository);
const paymentsController = new PaymentsController(logger, paymentsService);

export { paymentsController };
