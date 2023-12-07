import Joi from 'joi';

import { CommonValidationRules } from '~/libs/enums/enums.js';

import { UsersErrorMessage, UsersValidationRules } from '../enums/enums.js';

const commonUserSchema = {
  firstName: Joi.string()
    .min(CommonValidationRules.NAME_MIN_LENGTH)
    .max(CommonValidationRules.NAME_MAX_LENGTH)
    .messages({
      'string.base': UsersErrorMessage.FIELD_REQUIRED,
      'string.empty': UsersErrorMessage.FIELD_REQUIRED,
      'string.min': UsersErrorMessage.FIELD_MIN_LENGTH,
      'string.max': UsersErrorMessage.FIELD_MAX_LENGTH,
      'any.required': UsersErrorMessage.FIELD_REQUIRED,
    }),

  lastName: Joi.string()
    .min(CommonValidationRules.NAME_MIN_LENGTH)
    .max(CommonValidationRules.NAME_MAX_LENGTH)
    .messages({
      'string.base': UsersErrorMessage.STRING_BASE,
      'string.empty': UsersErrorMessage.FIELD_REQUIRED,
      'string.min': UsersErrorMessage.FIELD_MIN_LENGTH,
      'string.max': UsersErrorMessage.FIELD_MAX_LENGTH,
      'any.required': UsersErrorMessage.FIELD_REQUIRED,
    }),

  phone: Joi.string().pattern(UsersValidationRules.PHONE_PATTERN).messages({
    'string.base': UsersErrorMessage.STRING_BASE,
    'string.empty': UsersErrorMessage.FIELD_REQUIRED,
    'string.pattern.base': UsersErrorMessage.PHONE_INVALID,
    'any.required': UsersErrorMessage.FIELD_REQUIRED,
  }),

  email: Joi.string()
    .trim()
    .max(UsersValidationRules.EMAIL_MAX_LENGTH)
    .email()
    .messages({
      'string.base': UsersErrorMessage.STRING_BASE,
      'string.empty': UsersErrorMessage.FIELD_REQUIRED,
      'string.email': UsersErrorMessage.EMAIL_INVALID,
      'any.required': UsersErrorMessage.FIELD_REQUIRED,
    }),
  password: Joi.string()
    .trim()
    .pattern(new RegExp(UsersValidationRules.PASSWORD_PATTERN))
    .messages({
      'string.empty': UsersErrorMessage.FIELD_REQUIRED,
      'string.pattern.base': UsersErrorMessage.PASSWORD_INVALID,
    }),
};

export { commonUserSchema };
