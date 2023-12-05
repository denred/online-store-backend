import Joi from 'joi';

import { userCreateCommonValidationSchema } from '~/packages/users/users.js';

import { AuthErrorMessage, AuthValidationRules } from '../enums/enums.js';

const passwordSchema = Joi.string()
  .trim()
  .required()
  .pattern(new RegExp(AuthValidationRules.PASSWORD_PATTERN))
  .messages({
    'string.empty': AuthErrorMessage.FIELD_REQUIRED,
    'string.pattern.base': AuthErrorMessage.PASSWORD_INVALID,
  });

const userSignUpSchema = Joi.object({
  ...userCreateCommonValidationSchema,
  password: passwordSchema,
});

export { userSignUpSchema };
