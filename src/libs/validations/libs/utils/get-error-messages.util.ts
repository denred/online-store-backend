import { CommonErrorMessage } from '../enums/enums.js';

const getErrorMessages = (
  stringPatternBase?: string,
): Record<string, string> => ({
  'string.base': CommonErrorMessage.STRING_BASE,
  'string.empty': CommonErrorMessage.FIELD_REQUIRED,
  'any.required': CommonErrorMessage.FIELD_REQUIRED,
  'number.base': CommonErrorMessage.FIELD_INTEGER,
  'number.integer': CommonErrorMessage.FIELD_INTEGER,
  'number.min': CommonErrorMessage.FIELD_MIN_VALUE,
  'array.base': CommonErrorMessage.FIELD_ARRAY,
  'array.empty': CommonErrorMessage.EMPTY_ARRAY,
  'string.min': CommonErrorMessage.FIELD_MIN_LENGTH,
  'string.max': CommonErrorMessage.FIELD_MAX_LENGTH,
  'string.pattern.base':
    stringPatternBase ?? CommonErrorMessage.ZIP_CODE_NOT_NUMERIC,
  'any.only': CommonErrorMessage.FIELD_REQUIRED,
  'string.email': CommonErrorMessage.EMAIL_INVALID,
});

export { getErrorMessages };
