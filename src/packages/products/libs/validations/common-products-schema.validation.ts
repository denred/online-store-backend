import { Category, Colour, Size, Subcategory } from '@prisma/client';
import Joi from 'joi';

import { getErrorMessages } from '~/libs/validations/validations.js';

import { ProductValidationRules } from '../enums/enums.js';
import { quantitySchema } from './product-quantity-schema.validation.js';

const commonProductsSchema = {
  category: Joi.string()
    .valid(...Object.values(Category))
    .messages(getErrorMessages()),
  subcategory: Joi.string()
    .valid(...Object.values(Subcategory))
    .messages(getErrorMessages()),
  title: Joi.string()
    .trim()
    .max(ProductValidationRules.MAX_LENGTH)
    .messages({}),
  colour: Joi.string()
    .valid(...Object.values(Colour))
    .messages(getErrorMessages()),
  description: Joi.string()
    .max(ProductValidationRules.COMPOSITION_MAX_LENGTH)
    .messages(getErrorMessages()),
  composition: Joi.string()
    .max(ProductValidationRules.COMPOSITION_MAX_LENGTH)
    .messages(getErrorMessages()),
  size: Joi.array()
    .items(Joi.string().valid(...Object.values(Size)))
    .messages(getErrorMessages()),
  price: Joi.number()
    .precision(1)
    .min(ProductValidationRules.PRICE_MIN)
    .max(ProductValidationRules.PRICE_MAX)
    .messages(getErrorMessages()),
  brand: Joi.string()
    .max(ProductValidationRules.MAX_LENGTH)
    .messages(getErrorMessages()),
  collection: Joi.string()
    .max(ProductValidationRules.MAX_LENGTH)
    .messages(getErrorMessages()),
  manufacturer: Joi.string()
    .max(ProductValidationRules.MAX_LENGTH)
    .messages(getErrorMessages()),
  files: Joi.array().items(Joi.string()),
  quantity: quantitySchema,
};

export { commonProductsSchema };
