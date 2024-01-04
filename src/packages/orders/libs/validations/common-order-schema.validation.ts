import Joi from 'joi';

import {
  CommonValidationRules,
  getErrorMessages,
} from '~/libs/validations/validations.js';

import { OrdersValidationRules } from '../enums/enums.js';

const commonOrderSchema = {
  orderItemsSchema: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required().messages(getErrorMessages()),

        quantity: Joi.number()
          .integer()
          .min(OrdersValidationRules.MIN_QUANTITY)
          .required()
          .messages(getErrorMessages()),
      }).messages(getErrorMessages()),
    )
    .messages(getErrorMessages()),
  orderDeliverySchema: {
    address: Joi.string()
      .min(CommonValidationRules.NAME_MIN_LENGTH)
      .max(CommonValidationRules.NAME_MAX_LENGTH)
      .messages(getErrorMessages()),

    moreInfo: Joi.string()
      .max(OrdersValidationRules.MORE_INFO_MAX_LENGTH)
      .messages(getErrorMessages()),

    zipCode: Joi.string()
      .length(OrdersValidationRules.ZIP_CODE_LENGTH)
      .pattern(OrdersValidationRules.ZIP_CODE_PATTERN)
      .messages(getErrorMessages()),

    city: Joi.string()
      .min(CommonValidationRules.NAME_MIN_LENGTH)
      .max(CommonValidationRules.NAME_MAX_LENGTH)
      .messages(getErrorMessages()),

    state: Joi.string()
      .min(CommonValidationRules.NAME_MIN_LENGTH)
      .max(CommonValidationRules.NAME_MAX_LENGTH)
      .messages(getErrorMessages()),

    country: Joi.string()
      .min(CommonValidationRules.NAME_MIN_LENGTH)
      .max(CommonValidationRules.NAME_MAX_LENGTH)
      .messages(getErrorMessages()),
  },
};

export { commonOrderSchema };
