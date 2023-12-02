import Joi from 'joi';

import { OrderErrorMessage, OrdersValidationRules } from '../enums/enums.js';

const createOrderSchema = Joi.object({
  user: Joi.object({
    firstName: Joi.string()
      .min(OrdersValidationRules.NAME_MIN_LENGTH)
      .max(OrdersValidationRules.NAME_MAX_LENGTH)
      .required()
      .messages({
        'string.base': OrderErrorMessage.FIELD_REQUIRED,
        'string.empty': OrderErrorMessage.FIELD_REQUIRED,
        'string.min': OrderErrorMessage.FIELD_MIN_LENGTH,
        'string.max': OrderErrorMessage.FIELD_MAX_LENGTH,
        'any.required': OrderErrorMessage.FIELD_REQUIRED,
      }),

    lastName: Joi.string()
      .min(OrdersValidationRules.NAME_MIN_LENGTH)
      .max(OrdersValidationRules.NAME_MAX_LENGTH)
      .required()
      .messages({
        'string.base': OrderErrorMessage.STRING_BASE,
        'string.empty': OrderErrorMessage.FIELD_REQUIRED,
        'string.min': OrderErrorMessage.FIELD_MIN_LENGTH,
        'string.max': OrderErrorMessage.FIELD_MAX_LENGTH,
        'any.required': OrderErrorMessage.FIELD_REQUIRED,
      }),

    phone: Joi.string()
      .pattern(OrdersValidationRules.PHONE_PATTERN)
      .required()
      .messages({
        'string.base': OrderErrorMessage.STRING_BASE,
        'string.empty': OrderErrorMessage.FIELD_REQUIRED,
        'string.pattern.base': OrderErrorMessage.PHONE_INVALID,
        'any.required': OrderErrorMessage.FIELD_REQUIRED,
      }),

    email: Joi.string().email().required().messages({
      'string.base': OrderErrorMessage.STRING_BASE,
      'string.empty': OrderErrorMessage.FIELD_REQUIRED,
      'string.email': OrderErrorMessage.EMAIL_INVALID,
      'any.required': OrderErrorMessage.FIELD_REQUIRED,
    }),
  }).required(),

  orderDelivery: Joi.object({
    address: Joi.string()
      .min(OrdersValidationRules.NAME_MIN_LENGTH)
      .max(OrdersValidationRules.NAME_MAX_LENGTH)
      .required()
      .messages({
        'string.base': OrderErrorMessage.STRING_BASE,
        'string.empty': OrderErrorMessage.FIELD_REQUIRED,
        'string.min': OrderErrorMessage.FIELD_MIN_LENGTH,
        'string.max': OrderErrorMessage.FIELD_MAX_LENGTH,
        'any.required': OrderErrorMessage.FIELD_REQUIRED,
      }),

    moreInfo: Joi.string()
      .max(OrdersValidationRules.MORE_INFO_MAX_LENGTH)
      .messages({
        'string.base': OrderErrorMessage.STRING_BASE,
        'string.max': OrderErrorMessage.FIELD_MAX_LENGTH,
      }),

    zipCode: Joi.string()
      .min(OrdersValidationRules.ZIP_CODE_MIN_LENGTH)
      .max(OrdersValidationRules.ZIP_CODE_MAX_LENGTH)
      .required()
      .messages({
        'string.base': OrderErrorMessage.STRING_BASE,
        'string.empty': OrderErrorMessage.FIELD_REQUIRED,
        'string.min': OrderErrorMessage.FIELD_MIN_LENGTH,
        'string.max': OrderErrorMessage.FIELD_MAX_LENGTH,
        'any.required': OrderErrorMessage.FIELD_REQUIRED,
      }),

    city: Joi.string()
      .min(OrdersValidationRules.NAME_MIN_LENGTH)
      .max(OrdersValidationRules.NAME_MAX_LENGTH)
      .required()
      .messages({
        'string.base': OrderErrorMessage.STRING_BASE,
        'string.empty': OrderErrorMessage.FIELD_REQUIRED,
        'string.min': OrderErrorMessage.FIELD_MIN_LENGTH,
        'string.max': OrderErrorMessage.FIELD_MAX_LENGTH,
        'any.required': OrderErrorMessage.FIELD_REQUIRED,
      }),

    state: Joi.string()
      .min(OrdersValidationRules.NAME_MIN_LENGTH)
      .max(OrdersValidationRules.NAME_MAX_LENGTH)
      .required()
      .messages({
        'string.base': OrderErrorMessage.STRING_BASE,
        'string.empty': OrderErrorMessage.FIELD_REQUIRED,
        'string.min': OrderErrorMessage.FIELD_MIN_LENGTH,
        'string.max': OrderErrorMessage.FIELD_MAX_LENGTH,
        'any.required': OrderErrorMessage.FIELD_REQUIRED,
      }),

    country: Joi.string()
      .min(OrdersValidationRules.NAME_MIN_LENGTH)
      .max(OrdersValidationRules.NAME_MAX_LENGTH)
      .required()
      .messages({
        'string.base': OrderErrorMessage.STRING_BASE,
        'string.empty': OrderErrorMessage.FIELD_REQUIRED,
        'string.min': OrderErrorMessage.FIELD_MIN_LENGTH,
        'string.max': OrderErrorMessage.FIELD_MAX_LENGTH,
        'any.required': OrderErrorMessage.FIELD_REQUIRED,
      }),
  }).required(),

  orderItems: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required().messages({
          'string.base': OrderErrorMessage.STRING_BASE,
          'string.empty': OrderErrorMessage.FIELD_REQUIRED,
          'any.required': OrderErrorMessage.FIELD_REQUIRED,
        }),

        quantity: Joi.number()
          .integer()
          .min(OrdersValidationRules.QUANTITY_MIN)
          .required()
          .messages({
            'number.base': OrderErrorMessage.FIELD_INTEGER,
            'number.integer': OrderErrorMessage.FIELD_INTEGER,
            'number.min': OrderErrorMessage.FIELD_MIN_VALUE,
            'any.required': OrderErrorMessage.FIELD_REQUIRED,
          }),
      }),
    )
    .required()
    .messages({
      'array.base': OrderErrorMessage.FIELD_ARRAY,
      'array.empty': OrderErrorMessage.EMPTY_ARRAY,
    }),
});

export { createOrderSchema };
