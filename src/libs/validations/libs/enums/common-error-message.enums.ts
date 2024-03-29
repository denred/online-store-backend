const CommonErrorMessage = {
  STRING_BASE: '{{#label}} must be a string',
  FIELD_REQUIRED: '{{#label}} is mandatory',
  FIELD_MIN_LENGTH: '{{#label}} must be at least {{#limit}} characters long',
  FIELD_MAX_LENGTH: '{{#label}} must be at most {{#limit}} characters long',
  FIELD_MIN_VALUE: '{{#label}} must be at least {{#limit}}',
  ZIP_CODE_NOT_NUMERIC: 'Zip code must contain 5 digits',
  FIELD_INTEGER: '{{#label}} must be an integer',
  FIELD_ARRAY: '{{#label}} must be an array',
  EMPTY_ARRAY: '{{#label}} must be not empty',
  PHONE_INVALID: 'Phone must be in international format, starting with "+"',
  EMAIL_INVALID: 'Email must be a valid email address',
} as const;

export { CommonErrorMessage };
