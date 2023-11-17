import { type ErrorConstructor, type ValueOf } from '~/libs/types/types.js';

import { type HttpCode } from '../packages/http/enums/enums.js';
import { AppError } from './app-error.exception.js';

type HttpErrorConstructor = ErrorConstructor & {
  status: ValueOf<typeof HttpCode>;
};

class HttpError extends AppError {
  public status: ValueOf<typeof HttpCode>;

  public constructor({ message, cause, status }: HttpErrorConstructor) {
    super({
      message,
      cause,
    });

    this.status = status;
  }
}

export { HttpError };
