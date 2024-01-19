import { type File } from '@prisma/client';
import Joi from 'joi';

import { objectIdSchema } from '~/libs/validations/validations.js';

const filesKeyRequestParameters = Joi.object<Pick<File, 'id'>, true>({
  id: objectIdSchema,
});

export { filesKeyRequestParameters };
