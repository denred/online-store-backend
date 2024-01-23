import { type User } from '@prisma/client';
import Joi from 'joi';

import { objectIdSchema } from '~/libs/validations/validations.js';

const jwtPayloadSchema = Joi.object<Pick<User, 'id'>, true>({
  id: objectIdSchema.required(),
}).required();

export { jwtPayloadSchema };
