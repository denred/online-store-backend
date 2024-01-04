import Joi from 'joi';

import { commonOrderSchema } from '~/packages/orders/libs/validations/common-order-schema.validation.js';

const updateProductSchema = Joi.object({
  ...commonOrderSchema,
});

export { updateProductSchema };
