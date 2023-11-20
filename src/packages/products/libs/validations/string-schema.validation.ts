import joi from 'joi';

import { ErrorMessage } from '../enums/enums.js';

const stringSchema = (message: string): joi.StringSchema =>
  joi.string().required().messages({
    'string': message,
  });

const productParametersSchema = joi.object<{ id: string }, true>({
  id: stringSchema(ErrorMessage.ID_INVALID),
});

export { productParametersSchema };
