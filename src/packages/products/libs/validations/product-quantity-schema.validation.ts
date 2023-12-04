import Joi from 'joi';

import { ErrorMessage, ProductValidationRules } from '../enums/enums.js';

const quantitySchema = Joi.number()
  .positive()
  .integer()
  .max(ProductValidationRules.MAX_QUANTITY)
  .required()
  .messages({
    'number.base': ErrorMessage.QUANTITY_INVALID,
    'number.min': ErrorMessage.QUANTITY_INVALID,
    'number.max': ErrorMessage.QUANTITY_INVALID,
    'any.required': ErrorMessage.REQUIRED,
  });

const productQuantitySchema = Joi.object({ quantity: quantitySchema });

export { productQuantitySchema, quantitySchema };
