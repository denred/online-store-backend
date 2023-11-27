import { type Schema as ValidationSchema } from 'joi';

import { type HttpMethod } from '../../http/http.js';
import { type ApiHandler } from './api-handler.type.js';
import { type AuthStrategyHandler } from './types.js';
import { type ValidateFilesStrategyOptions } from './validate-files-strategy-options.type.js';

type ControllerRouteParameters = {
  path: string;
  method: HttpMethod;
  handler: ApiHandler;
  validateFilesStrategy?: ValidateFilesStrategyOptions;
  authStrategy?: AuthStrategyHandler;
  validation?: {
    body?: ValidationSchema;
    params?: ValidationSchema;
    query?: ValidationSchema;
  };
};

export { type ControllerRouteParameters };
