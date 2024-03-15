import { PasswordLimits } from './users-validation-rules.enum.js';

const UsersErrorMessage = {
  ALREADY_EXISTS: 'A user with the same email or phone number already exists.',
  NOT_FOUND: 'User is not found.',
  PHONE_INVALID: 'Phone must be in international format, starting with "+"',
  PASSWORD_INVALID: `Password must contain at least 1 letter, 1 digit, and be from ${PasswordLimits.MIN_LENGTH} to ${PasswordLimits.MAX_LENGTH} characters long.`,
  INVALID_GOOGLE_DATA: 'Invalid data received from Google API',
} as const;

export { UsersErrorMessage };
