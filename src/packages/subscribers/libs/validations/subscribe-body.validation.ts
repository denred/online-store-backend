import Joi from 'joi';

import { SubscriptionValidationMessage } from '../enums/enums.js';

const subscriptionBodyValidation = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': SubscriptionValidationMessage.STRING_BASE,
    'string.email': SubscriptionValidationMessage.STRING_EMAIL,
    'any.required': SubscriptionValidationMessage.ANY_REQUIRED,
  }),
  firstName: Joi.string(),
  lastName: Joi.string(),
  preferences: Joi.object({
    receiveNewsletter: Joi.boolean(),
    productUpdates: Joi.boolean(),
  }),
});

export { subscriptionBodyValidation };
