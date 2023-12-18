import { HttpCode } from '~/libs/packages/packages.js';
import { type ValueOf } from '~/libs/types/value-of.type.js';

import { HttpError } from '../http-error.exception.js';

/**
 * @throws {HttpError}
 */
const throwError = (
  message: string,
  status?: ValueOf<typeof HttpCode>,
  error?: typeof HttpError,
): never => {
  throw error
    ? new error({ status: status ?? HttpCode.BAD_REQUEST, message })
    : new HttpError({ status: status ?? HttpCode.BAD_REQUEST, message });
};

export { throwError };
