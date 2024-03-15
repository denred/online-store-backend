import { type ErrorConstructor } from '../types/types.js';
import { HttpError } from './http-error.exception.js';
import { HttpCode, HttpMessage } from '../packages/http/http.js';

class UnauthorizedError extends HttpError {
  public constructor({ message, cause }: ErrorConstructor) {
    super({
      message: message ?? HttpMessage.UNAUTHORIZED,
      cause,
      status: HttpCode.UNAUTHORIZED,
    });
  }
}

export { UnauthorizedError };
