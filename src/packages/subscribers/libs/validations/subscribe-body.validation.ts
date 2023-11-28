import Joi from 'joi';

import { SubscribeValidationMessage } from '../enums/enums.js';

const subscribeBodyValidation = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': SubscribeValidationMessage.STRING_BASE,
    'string.email': SubscribeValidationMessage.STRING_EMAIL,
    'any.required': SubscribeValidationMessage.ANY_REQUIRED,
  }),
  firstName: Joi.string(),
  lastName: Joi.string(),
  preferences: Joi.object({
    receiveNewsletter: Joi.boolean(),
    productUpdates: Joi.boolean(),
  }),
});

export { subscribeBodyValidation };
