import Joi from 'joi';

import { objectIdSchema } from '~/libs/validations/validations.js';

const productParametersSchema = Joi.object<{ id: string }, true>({
  id: objectIdSchema,
});

export { productParametersSchema };
