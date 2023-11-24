import { HttpCode } from '../packages/http/http.js';
import { HttpError } from './http-error.exception.js';

type Constructor = {
  message: string;
  cause?: unknown;
};

class InvalidFileError extends HttpError {
  public constructor({ message, cause }: Constructor) {
    super({
      message,
      status: HttpCode.BAD_REQUEST,
      cause,
    });
  }
}

export { InvalidFileError };
