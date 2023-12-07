import Joi from 'joi';

import { CommonValidationRules } from '~/libs/enums/enums.js';

import { OrderErrorMessage, OrdersValidationRules } from '../enums/enums.js';

const commonOrderSchema = {
  orderItemsSchema: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required().messages({
          'string.base': OrderErrorMessage.STRING_BASE,
          'string.empty': OrderErrorMessage.FIELD_REQUIRED,
          'any.required': OrderErrorMessage.FIELD_REQUIRED,
        }),

        quantity: Joi.number()
          .integer()
          .min(OrdersValidationRules.MIN_QUANTITY)
          .required()
          .messages({
            'number.base': OrderErrorMessage.FIELD_INTEGER,
            'number.integer': OrderErrorMessage.FIELD_INTEGER,
            'number.min': OrderErrorMessage.FIELD_MIN_VALUE,
            'any.required': OrderErrorMessage.FIELD_REQUIRED,
          }),
      }).messages({
        'array.base': OrderErrorMessage.FIELD_ARRAY,
        'array.empty': OrderErrorMessage.EMPTY_ARRAY,
      }),
    )
    .messages({
      'array.base': OrderErrorMessage.FIELD_ARRAY,
      'array.empty': OrderErrorMessage.EMPTY_ARRAY,
    }),
  orderDeliverySchema: {
    address: Joi.string()
      .min(CommonValidationRules.NAME_MIN_LENGTH)
      .max(CommonValidationRules.NAME_MAX_LENGTH)
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
      .length(OrdersValidationRules.ZIP_CODE_LENGTH)
      .pattern(OrdersValidationRules.ZIP_CODE_PATTERN)
      .messages({
        'string.base': OrderErrorMessage.STRING_BASE,
        'string.empty': OrderErrorMessage.FIELD_REQUIRED,
        'any.required': OrderErrorMessage.FIELD_REQUIRED,
        'string.pattern.base': OrderErrorMessage.ZIP_CODE_NOT_NUMERIC,
      }),

    city: Joi.string()
      .min(CommonValidationRules.NAME_MIN_LENGTH)
      .max(CommonValidationRules.NAME_MAX_LENGTH)
      .messages({
        'string.base': OrderErrorMessage.STRING_BASE,
        'string.empty': OrderErrorMessage.FIELD_REQUIRED,
        'string.min': OrderErrorMessage.FIELD_MIN_LENGTH,
        'string.max': OrderErrorMessage.FIELD_MAX_LENGTH,
        'any.required': OrderErrorMessage.FIELD_REQUIRED,
      }),

    state: Joi.string()
      .min(CommonValidationRules.NAME_MIN_LENGTH)
      .max(CommonValidationRules.NAME_MAX_LENGTH)
      .messages({
        'string.base': OrderErrorMessage.STRING_BASE,
        'string.empty': OrderErrorMessage.FIELD_REQUIRED,
        'string.min': OrderErrorMessage.FIELD_MIN_LENGTH,
        'string.max': OrderErrorMessage.FIELD_MAX_LENGTH,
        'any.required': OrderErrorMessage.FIELD_REQUIRED,
      }),

    country: Joi.string()
      .min(CommonValidationRules.NAME_MIN_LENGTH)
      .max(CommonValidationRules.NAME_MAX_LENGTH)
      .messages({
        'string.base': OrderErrorMessage.STRING_BASE,
        'string.empty': OrderErrorMessage.FIELD_REQUIRED,
        'string.min': OrderErrorMessage.FIELD_MIN_LENGTH,
        'string.max': OrderErrorMessage.FIELD_MAX_LENGTH,
        'any.required': OrderErrorMessage.FIELD_REQUIRED,
      }),
  },
};

export { commonOrderSchema };
