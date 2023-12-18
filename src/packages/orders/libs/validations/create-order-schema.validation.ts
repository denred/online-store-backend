import Joi from 'joi';

import { commonUserSchema } from '~/packages/users/users.js';

import { commonOrderSchema } from './common-order-schema.validation.js';

const { firstName, lastName, phone, email } = commonUserSchema;
const { orderItemsSchema, orderDeliverySchema } = commonOrderSchema;
const { address, zipCode, moreInfo, city, state, country } =
  orderDeliverySchema;

const createOrderSchema = Joi.object({
  user: Joi.object({
    firstName: firstName.required(),
    lastName: lastName.required(),
    phone: phone.required(),
    email: email.required(),
  }).required(),

  orderDelivery: Joi.object({
    address: address.required(),
    moreInfo: moreInfo,
    zipCode: zipCode.required(),
    city: city.required(),
    state: state.required(),
    country: country.required(),
  }).required(),

  orderItems: orderItemsSchema.required(),
});

export { createOrderSchema };
