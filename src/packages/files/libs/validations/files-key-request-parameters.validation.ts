import { type File } from '@prisma/client';
import Joi from 'joi';

const filesKeyRequestParameters = Joi.object<Pick<File, 'id'>, true>({
  id: Joi.string(),
});

export { filesKeyRequestParameters };
