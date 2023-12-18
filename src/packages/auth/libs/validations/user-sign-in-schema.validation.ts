import Joi from 'joi';

import { commonUserSchema } from '~/packages/users/users.js';

const { email, password } = commonUserSchema;

const userSignInSchema = Joi.object({
  email: email.required(),
  password: password.required(),
});

export { userSignInSchema };
