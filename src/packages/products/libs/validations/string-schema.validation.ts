import joi from 'joi';

import { getStringValidationSchema } from '~/libs/helpers/helpers.js';

import { ErrorMessage } from '../enums/enums.js';

const productParametersSchema = joi.object<{ id: string }, true>({
  id: getStringValidationSchema(ErrorMessage.ID_INVALID),
});

export { productParametersSchema };
