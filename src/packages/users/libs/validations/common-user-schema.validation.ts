import Joi from 'joi';

import {
  CommonValidationRules,
  getErrorMessages,
} from '~/libs/validations/validations.js';

import { UsersErrorMessage, UsersValidationRules } from '../enums/enums.js';

const commonUserSchema = {
  firstName: Joi.string()
    .min(CommonValidationRules.NAME_MIN_LENGTH)
    .max(CommonValidationRules.NAME_MAX_LENGTH)
    .messages(getErrorMessages()),

  lastName: Joi.string()
    .min(CommonValidationRules.NAME_MIN_LENGTH)
    .max(CommonValidationRules.NAME_MAX_LENGTH)
    .messages(getErrorMessages()),

  phone: Joi.string()
    .pattern(UsersValidationRules.PHONE_PATTERN)
    .messages(getErrorMessages(UsersErrorMessage.PHONE_INVALID)),

  email: Joi.string()
    .trim()
    .max(UsersValidationRules.EMAIL_MAX_LENGTH)
    .email()
    .messages(getErrorMessages()),
  password: Joi.string()
    .trim()
    .pattern(new RegExp(UsersValidationRules.PASSWORD_PATTERN))
    .messages(getErrorMessages(UsersErrorMessage.PASSWORD_INVALID)),
};

export { commonUserSchema };
