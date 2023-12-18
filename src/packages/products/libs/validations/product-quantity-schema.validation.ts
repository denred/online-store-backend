import Joi from 'joi';

import {
  ProductsErrorMessage,
  ProductValidationRules,
} from '../enums/enums.js';

const quantitySchema = Joi.number()
  .positive()
  .integer()
  .max(ProductValidationRules.MAX_QUANTITY)
  .required()
  .messages({
    'number.base': ProductsErrorMessage.QUANTITY_INVALID,
    'number.min': ProductsErrorMessage.QUANTITY_INVALID,
    'number.max': ProductsErrorMessage.QUANTITY_INVALID,
    'any.required': ProductsErrorMessage.REQUIRED,
  });

const productQuantitySchema = Joi.object({ quantity: quantitySchema });

export { productQuantitySchema, quantitySchema };
