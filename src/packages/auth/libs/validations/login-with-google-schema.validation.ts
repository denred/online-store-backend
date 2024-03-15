import joi from 'joi';
import { GooglePayload } from '../types/google-payload.type.js';
import { getErrorMessages } from '~/libs/validations/validations.js';

const loginWithGoogleSchema = joi.object<GooglePayload, true>({
  code: joi.string().trim().required().messages(getErrorMessages()),
});

export { loginWithGoogleSchema };
