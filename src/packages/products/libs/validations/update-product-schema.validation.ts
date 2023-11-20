import { Category, Colour, Size, Subcategory } from '@prisma/client';
import Joi from 'joi';

import { ErrorMessage, ProductValidationRules } from '../enums/enums.js';

const updateProductSchema = Joi.object({
  category: Joi.string()
    .valid(...Object.values(Category))
    .messages({
      'any.only': ErrorMessage.INVALID,
    }),
  subcategory: Joi.string()
    .valid(...Object.values(Subcategory))
    .messages({
      'any.only': ErrorMessage.INVALID,
    }),
  title: Joi.string().trim().max(ProductValidationRules.MAX_LENGTH).messages({
    'any.only': ErrorMessage.INVALID,
    'string.empty': ErrorMessage.REQUIRED,
    'string.max': ErrorMessage.MAX_LENGTH,
  }),
  colour: Joi.string()
    .valid(...Object.values(Colour))
    .messages({
      'any.only': ErrorMessage.INVALID,
    }),
  description: Joi.string()
    .max(ProductValidationRules.COMPOSITION_MAX_LENGTH)
    .messages({
      'any.only': ErrorMessage.INVALID,
      'string.empty': ErrorMessage.REQUIRED,
      'string.max': ErrorMessage.DESCRIPTION_MAX_LENGTH,
    }),
  composition: Joi.string()
    .max(ProductValidationRules.COMPOSITION_MAX_LENGTH)
    .messages({
      'any.only': ErrorMessage.INVALID,
      'string.empty': ErrorMessage.REQUIRED,
      'string.max': ErrorMessage.COMPOSITION_MAX_LENGTH,
    }),
  size: Joi.array()
    .items(Joi.string().valid(...Object.values(Size)))
    .messages({
      'any.only': ErrorMessage.INVALID,
    }),
  price: Joi.number()
    .precision(1)
    .min(ProductValidationRules.PRICE_MIN)
    .max(ProductValidationRules.PRICE_MAX)
    .messages({
      'number.base': ErrorMessage.PRICE_INVALID,
      'number.min': ErrorMessage.PRICE_INVALID,
      'number.max': ErrorMessage.PRICE_INVALID,
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
  images: Joi.array().items(Joi.string()),
});

export { updateProductSchema };
