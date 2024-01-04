import Joi from 'joi';

import { CommonValidationMessage } from '../enums/enums.js';

const objectIdSchema = Joi.string()
  .pattern(/^[\dA-Fa-f]{24}$/)
  .messages({
    'string.pattern.base': CommonValidationMessage.INVALID_OBJECT_ID,
    'string.empty': CommonValidationMessage.OBJECT_ID_EMPTY,
  });

export { objectIdSchema };
