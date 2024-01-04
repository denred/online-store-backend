import Joi from 'joi';

import { getErrorMessages } from '~/libs/validations/validations.js';

import { ProductValidationRules } from '../enums/enums.js';

const quantitySchema = Joi.number()
  .positive()
  .integer()
  .max(ProductValidationRules.MAX_QUANTITY)
  .required()
  .messages(getErrorMessages());

const productQuantitySchema = Joi.object({ quantity: quantitySchema });

export { productQuantitySchema, quantitySchema };
