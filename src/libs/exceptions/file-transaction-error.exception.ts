import { S3ErrorMessage } from '~/packages/files/libs/enums/enums.js';

import { HttpCode } from '../packages/http/http.js';
import { HttpError } from './http-error.exception.js';

type Constructor = {
  message?: string;
  cause?: unknown;
};

class FileTransactionError extends HttpError {
  public constructor({ message, cause }: Constructor) {
    super({
      message: message ?? S3ErrorMessage.FILE_TRANSACTION_ERROR_MESSAGE,
      status: HttpCode.BAD_REQUEST,
      cause,
    });
  }
}

export { FileTransactionError };
