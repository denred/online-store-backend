import { database } from '~/libs/packages/database/database.js';
import { logger } from '~/libs/packages/logger/logger.js';
import { s3Bucket } from '~/libs/packages/s3-bucket/s3-bucket.js';

import { FilesController } from './files.controller.js';
import { FilesRepoitory } from './files.repository.js';
import { FilesService } from './files.service.js';

const filesRepository = new FilesRepoitory(database);
const filesService = new FilesService(s3Bucket, logger, filesRepository);
const filesController = new FilesController(logger, filesService);

export { filesService };
export { filesController };
export { type FilesService } from './files.service.js';
export { FilesValidationStrategy } from './libs/enums/enums.js';
export { type FastifyFileValidationFunction } from './libs/types/types.js';
