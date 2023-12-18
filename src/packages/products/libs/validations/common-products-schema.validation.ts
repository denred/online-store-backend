import { Category, Colour, Size, Subcategory } from '@prisma/client';
import Joi from 'joi';

import {
  ProductsErrorMessage,
  ProductValidationRules,
} from '../enums/enums.js';
import { quantitySchema } from './product-quantity-schema.validation.js';

const commonProductsSchema = {
  category: Joi.string()
    .valid(...Object.values(Category))
    .messages({
      'any.only': ProductsErrorMessage.INVALID,
      'any.required': ProductsErrorMessage.REQUIRED,
    }),
  subcategory: Joi.string()
    .valid(...Object.values(Subcategory))
    .messages({
      'any.only': ProductsErrorMessage.INVALID,
      'any.required': ProductsErrorMessage.REQUIRED,
    }),
  title: Joi.string().trim().max(ProductValidationRules.MAX_LENGTH).messages({
    'any.only': ProductsErrorMessage.INVALID,
    'any.required': ProductsErrorMessage.REQUIRED,
    'string.empty': ProductsErrorMessage.REQUIRED,
    'string.max': ProductsErrorMessage.MAX_LENGTH,
  }),
  colour: Joi.string()
    .valid(...Object.values(Colour))
    .messages({
      'any.only': ProductsErrorMessage.INVALID,
      'any.required': ProductsErrorMessage.REQUIRED,
    }),
  description: Joi.string()
    .max(ProductValidationRules.COMPOSITION_MAX_LENGTH)
    .messages({
      'any.only': ProductsErrorMessage.INVALID,
      'any.required': ProductsErrorMessage.REQUIRED,
      'string.empty': ProductsErrorMessage.REQUIRED,
      'string.max': ProductsErrorMessage.DESCRIPTION_MAX_LENGTH,
    }),
  composition: Joi.string()
    .max(ProductValidationRules.COMPOSITION_MAX_LENGTH)
    .messages({
      'any.only': ProductsErrorMessage.INVALID,
      'any.required': ProductsErrorMessage.REQUIRED,
      'string.empty': ProductsErrorMessage.REQUIRED,
      'string.max': ProductsErrorMessage.COMPOSITION_MAX_LENGTH,
    }),
  size: Joi.array()
    .items(Joi.string().valid(...Object.values(Size)))
    .messages({
      'any.only': ProductsErrorMessage.INVALID,
      'any.required': ProductsErrorMessage.REQUIRED,
    }),
  price: Joi.number()
    .precision(1)
    .min(ProductValidationRules.PRICE_MIN)
    .max(ProductValidationRules.PRICE_MAX)
    .messages({
      'number.base': ProductsErrorMessage.PRICE_INVALID,
      'number.min': ProductsErrorMessage.PRICE_INVALID,
      'number.max': ProductsErrorMessage.PRICE_INVALID,
      'any.required': ProductsErrorMessage.REQUIRED,
    }),
  brand: Joi.string().max(ProductValidationRules.MAX_LENGTH).messages({
    'any.only': ProductsErrorMessage.INVALID,
    'string.max': ProductsErrorMessage.MAX_LENGTH,
  }),
  collection: Joi.string().max(ProductValidationRules.MAX_LENGTH).messages({
    'any.only': ProductsErrorMessage.INVALID,
    'string.max': ProductsErrorMessage.MAX_LENGTH,
  }),
  manufacturer: Joi.string().max(ProductValidationRules.MAX_LENGTH).messages({
    'any.only': ProductsErrorMessage.INVALID,
    'string.max': ProductsErrorMessage.MAX_LENGTH,
  }),
  files: Joi.array().items(Joi.string()),
  quantity: quantitySchema,
};

export { commonProductsSchema };
