import { type ErrorConstructor } from '../types/types.js';

class ConfigValidationError extends Error {
  public constructor({ message, cause }: ErrorConstructor) {
    super(message, {
      cause,
    });
  }
}

export { ConfigValidationError };
