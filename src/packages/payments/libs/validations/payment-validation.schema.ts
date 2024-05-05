import Joi from 'joi';
import { type Payment } from '../types/types.js';
import { ErrorMessage, PaymentRule } from '../enums/enums.js';
import { objectIdSchema } from '~/libs/validations/validations.js';

const paymentValidationSchema = Joi.object<Payment, true>({
  cardNumber: Joi.string()
    .pattern(/^[0-9]{16}$/)
    .required()
    .messages({
      'string.base': ErrorMessage.CARD_NUMBER_REQUIRED,
      'any.required': ErrorMessage.CARD_NUMBER_REQUIRED,
      'any.base': ErrorMessage.CARD_NUMBER_REQUIRED,
      'any.pattern': ErrorMessage.CARD_NUMBER_INVALID,
      'string.pattern.base': ErrorMessage.CARD_NUMBER_INVALID,
    }),
  cardHolder: Joi.string().required().messages({
    'string.base': ErrorMessage.CARD_HOLDER_REQUIRED,
    'string.empty': ErrorMessage.CARD_HOLDER_REQUIRED,
    'any.required': ErrorMessage.CARD_HOLDER_REQUIRED,
  }),
  month: Joi.number()
    .integer()
    .min(PaymentRule.MONTH.MIN)
    .max(PaymentRule.MONTH.MAX)
    .required()
    .messages({
      'number.base': ErrorMessage.MONTH_REQUIRED,
      'number.min': ErrorMessage.MONTH_INVALID,
      'number.max': ErrorMessage.MONTH_INVALID,
      'any.required': ErrorMessage.MONTH_REQUIRED,
    }),
  year: Joi.number()
    .integer()
    .min(PaymentRule.YEAR.MIN)
    .max(PaymentRule.YEAR.MAX)
    .required()
    .messages({
      'number.base': ErrorMessage.YEAR_REQUIRED,
      'number.min': ErrorMessage.YEAR_INVALID,
      'number.max': ErrorMessage.YEAR_INVALID,
      'any.required': ErrorMessage.YEAR_REQUIRED,
    }),
  cvv: Joi.number()
    .integer()
    .min(PaymentRule.CVV.MIN)
    .max(PaymentRule.CVV.MAX)
    .required()
    .messages({
      'number.base': ErrorMessage.CVV_REQUIRED,
      'number.min': ErrorMessage.CVV_INVALID,
      'number.max': ErrorMessage.CVV_INVALID,
      'any.required': ErrorMessage.CVV_REQUIRED,
    }),
  orderId: objectIdSchema,
});

export { paymentValidationSchema };
