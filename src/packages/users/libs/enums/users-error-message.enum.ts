import { PasswordLimits } from './users-validation-rules.enum.js';

const UsersErrorMessage = {
  ALREADY_EXISTS: 'A user with the same email or phone number already exists.',
  NOT_FOUND: 'User is not found.',
  STRING_BASE: '{{#label}} must be a string',
  FIELD_REQUIRED: '{{#label}} is mandatory',
  FIELD_MIN_LENGTH: '{{#label}} must be at least {{#limit}} characters long',
  FIELD_MAX_LENGTH: '{{#label}} must be at most {{#limit}} characters long',
  FIELD_MIN_VALUE: '{{#label}} must be at least {{#limit}}',
  FIELD_INTEGER: '{{#label}} must be an integer',
  FIELD_ARRAY: '{{#label}} must be an array',
  EMPTY_ARRAY: '{{#label}} must be not empty',
  PHONE_INVALID: 'Phone must be in international format, starting with "+"',
  EMAIL_INVALID: 'Email must be a valid email address',
  PASSWORD_INVALID: `Password must contain at least 1 letter, 1 digit, and be from ${PasswordLimits.MIN_LENGTH} to ${PasswordLimits.MAX_LENGTH} characters long.`,
} as const;

export { UsersErrorMessage };
