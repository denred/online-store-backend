import Joi from 'joi';

import { commonUserSchema } from '~/packages/users/users.js';

const { firstName, lastName, phone, email, password } = commonUserSchema;

const userSignUpSchema = Joi.object({
  firstName: firstName.required(),
  lastName: lastName.required(),
  phone: phone.required(),
  email: email.required(),
  password: password.required(),
});

export { userSignUpSchema };
