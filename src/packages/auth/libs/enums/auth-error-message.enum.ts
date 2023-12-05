import {
  PASSWORD_LENGTH_MAX,
  PASSWORD_LENGTH_MIN,
} from './auth-validation-rules.enums.js';

const AuthErrorMessage = {
  FIELD_REQUIRED: '{{#label}} is mandatory',
  PASSWORD_INVALID: `Password must contain at least 1 letter, 1 digit, and be from ${PASSWORD_LENGTH_MIN} to ${PASSWORD_LENGTH_MAX} characters long.`,
} as const;

export { AuthErrorMessage };
