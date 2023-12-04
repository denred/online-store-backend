import { Category, Colour, Size, Subcategory } from '@prisma/client';
import Joi from 'joi';

import { ErrorMessage, ProductValidationRules } from '../enums/enums.js';
import { quantitySchema } from './product-quantity-schema.validation.js';

const createProductSchema = Joi.object({
  category: Joi.string()
    .valid(...Object.values(Category))
    .required()
    .messages({
      'any.only': ErrorMessage.INVALID,
      'any.required': ErrorMessage.REQUIRED,
    }),
  subcategory: Joi.string()
    .valid(...Object.values(Subcategory))
    .required()
    .messages({
      'any.only': ErrorMessage.INVALID,
      'any.required': ErrorMessage.REQUIRED,
    }),
  title: Joi.string()
    .trim()
    .max(ProductValidationRules.MAX_LENGTH)
    .required()
    .messages({
      'any.only': ErrorMessage.INVALID,
      'any.required': ErrorMessage.REQUIRED,
      'string.empty': ErrorMessage.REQUIRED,
      'string.max': ErrorMessage.MAX_LENGTH,
    }),
  colour: Joi.string()
    .valid(...Object.values(Colour))
    .required()
    .messages({
      'any.only': ErrorMessage.INVALID,
      'any.required': ErrorMessage.REQUIRED,
    }),
  description: Joi.string()
    .max(ProductValidationRules.COMPOSITION_MAX_LENGTH)
    .required()
    .messages({
      'any.only': ErrorMessage.INVALID,
      'any.required': ErrorMessage.REQUIRED,
      'string.empty': ErrorMessage.REQUIRED,
      'string.max': ErrorMessage.DESCRIPTION_MAX_LENGTH,
    }),
  composition: Joi.string()
    .max(ProductValidationRules.COMPOSITION_MAX_LENGTH)
    .required()
    .messages({
      'any.only': ErrorMessage.INVALID,
      'any.required': ErrorMessage.REQUIRED,
      'string.empty': ErrorMessage.REQUIRED,
      'string.max': ErrorMessage.COMPOSITION_MAX_LENGTH,
    }),
  size: Joi.array()
    .items(Joi.string().valid(...Object.values(Size)))
    .required()
    .messages({
      'any.only': ErrorMessage.INVALID,
      'any.required': ErrorMessage.REQUIRED,
    }),
  price: Joi.number()
    .precision(1)
    .min(ProductValidationRules.PRICE_MIN)
    .max(ProductValidationRules.PRICE_MAX)
    .required()
    .messages({
      'number.base': ErrorMessage.PRICE_INVALID,
      'number.min': ErrorMessage.PRICE_INVALID,
      'number.max': ErrorMessage.PRICE_INVALID,
      'any.required': ErrorMessage.REQUIRED,
    }),
  brand: Joi.string().max(ProductValidationRules.MAX_LENGTH).messages({
    'any.only': ErrorMessage.INVALID,
    'string.max': ErrorMessage.MAX_LENGTH,
  }),
  collection: Joi.string().max(ProductValidationRules.MAX_LENGTH).messages({
    'any.only': ErrorMessage.INVALID,
    'string.max': ErrorMessage.MAX_LENGTH,
  }),
  manufacturer: Joi.string().max(ProductValidationRules.MAX_LENGTH).messages({
    'any.only': ErrorMessage.INVALID,
    'string.max': ErrorMessage.MAX_LENGTH,
  }),
  files: Joi.array().items(Joi.string()),
  quantity: quantitySchema,
});

export { createProductSchema };
