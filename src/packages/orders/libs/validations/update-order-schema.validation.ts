import Joi from 'joi';

import { commonUserSchema } from '~/packages/users/users.js';

import { commonOrderSchema } from './common-order-schema.validation.js';

const { orderItemsSchema, orderDeliverySchema } = commonOrderSchema;

const updateOrderSchema = Joi.object({
  user: Joi.object({ ...commonUserSchema }),

  orderDelivery: orderDeliverySchema,

  orderItems: orderItemsSchema,
});

export { updateOrderSchema };
