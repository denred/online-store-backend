import { type ErrorConstructor } from '~/libs/types/types.js';

class AppError extends Error {
  public constructor({ message, cause }: ErrorConstructor) {
    super(message, {
      cause,
    });
  }
}

export { AppError };
