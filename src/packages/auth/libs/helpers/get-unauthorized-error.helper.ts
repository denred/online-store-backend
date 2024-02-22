import { HttpError } from '~/libs/exceptions/exceptions.js';
import { HttpCode, HttpMessage } from '~/libs/packages/packages.js';

const getUnauthorizedError = ({
  message,
  cause,
}: {
  message?: string;
  cause?: unknown;
} = {}): HttpError => {
  throw new HttpError({
    message: message ?? HttpMessage.UNAUTHORIZED,
    status: HttpCode.UNAUTHORIZED,
    cause,
  });
};

export { getUnauthorizedError };
