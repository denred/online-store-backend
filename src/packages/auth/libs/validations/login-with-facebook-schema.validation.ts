import joi from 'joi';
import { type SignInWIthFacebook } from '../types/types.js';
import { getErrorMessages } from '~/libs/validations/validations.js';
import { commonUserSchema } from '~/packages/users/libs/validations/validations.js';

const { firstName, lastName, email } = commonUserSchema;

const loginWithFacebookSchema = joi.object<SignInWIthFacebook, true>({
  accessToken: joi.string().trim().required().messages(getErrorMessages()),
  firstName,
  lastName,
  email,
});

export { loginWithFacebookSchema };
