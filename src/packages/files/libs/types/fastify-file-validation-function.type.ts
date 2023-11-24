import { type preHandlerHookHandler } from 'fastify';

import { type FileInputConfig } from './types.js';

type FastifyFileValidationFunction = (
  fileInputConfig: FileInputConfig,
) => preHandlerHookHandler;

export { type FastifyFileValidationFunction };
