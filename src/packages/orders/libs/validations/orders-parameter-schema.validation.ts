import joi from 'joi';

import { objectIdSchema } from '~/libs/validations/validations.js';

const ordersParametersSchema = joi.object<{ id: string }, true>({
  id: objectIdSchema,
});

export { ordersParametersSchema };
