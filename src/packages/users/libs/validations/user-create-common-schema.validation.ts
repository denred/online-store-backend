import Joi from 'joi';

import { UsersErrorMessage, UsersValidationRules } from '../enums/enums.js';

const userCreateCommonValidationSchema = {
  firstName: Joi.string()
    .min(UsersValidationRules.NAME_MIN_LENGTH)
    .max(UsersValidationRules.NAME_MAX_LENGTH)
    .required()
    .messages({
      'string.base': UsersErrorMessage.FIELD_REQUIRED,
      'string.empty': UsersErrorMessage.FIELD_REQUIRED,
      'string.min': UsersErrorMessage.FIELD_MIN_LENGTH,
      'string.max': UsersErrorMessage.FIELD_MAX_LENGTH,
      'any.required': UsersErrorMessage.FIELD_REQUIRED,
    }),

  lastName: Joi.string()
    .min(UsersValidationRules.NAME_MIN_LENGTH)
    .max(UsersValidationRules.NAME_MAX_LENGTH)
    .required()
    .messages({
      'string.base': UsersErrorMessage.STRING_BASE,
      'string.empty': UsersErrorMessage.FIELD_REQUIRED,
      'string.min': UsersErrorMessage.FIELD_MIN_LENGTH,
      'string.max': UsersErrorMessage.FIELD_MAX_LENGTH,
      'any.required': UsersErrorMessage.FIELD_REQUIRED,
    }),

  phone: Joi.string()
    .pattern(UsersValidationRules.PHONE_PATTERN)
    .required()
    .messages({
      'string.base': UsersErrorMessage.STRING_BASE,
      'string.empty': UsersErrorMessage.FIELD_REQUIRED,
      'string.pattern.base': UsersErrorMessage.PHONE_INVALID,
      'any.required': UsersErrorMessage.FIELD_REQUIRED,
    }),

  email: Joi.string().email().required().messages({
    'string.base': UsersErrorMessage.STRING_BASE,
    'string.empty': UsersErrorMessage.FIELD_REQUIRED,
    'string.email': UsersErrorMessage.EMAIL_INVALID,
    'any.required': UsersErrorMessage.FIELD_REQUIRED,
  }),
};

export { userCreateCommonValidationSchema };
