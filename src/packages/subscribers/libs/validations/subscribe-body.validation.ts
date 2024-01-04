import Joi from 'joi';

import { getErrorMessages } from '~/libs/validations/validations.js';

const subscriptionBodyValidation = Joi.object({
  email: Joi.string().email().required().messages(getErrorMessages()),
  firstName: Joi.string(),
  lastName: Joi.string(),
  preferences: Joi.object({
    receiveNewsletter: Joi.boolean(),
    productUpdates: Joi.boolean(),
  }),
});

export { subscriptionBodyValidation };
