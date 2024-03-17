import Joi from 'joi';

import { getErrorMessages } from '~/libs/validations/validations.js';

import { ProductValidationRules } from '../enums/enums.js';
import { Size } from '@prisma/client';

const quantitySchema = Joi.number()
  .positive()
  .integer()
  .max(ProductValidationRules.MAX_QUANTITY)
  .messages(getErrorMessages());

const quantitiesSchema = Object.values(Size).reduce(
  (record: Record<Size, number>, size: Size) => ({
    ...record,
    [size]: quantitySchema,
  }),
  {} as Record<Size, number>,
);

const productQuantitySchema = Joi.object({
  quantities: Joi.object(quantitiesSchema),
});

export { productQuantitySchema, quantitySchema };
