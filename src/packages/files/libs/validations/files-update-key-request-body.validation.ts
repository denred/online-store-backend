import { type File } from '@prisma/client';
import Joi from 'joi';

import { FilesValidationErrorMessage } from '../enums/enums.js';

const filesUpdateKeyRequestBody = Joi.object<Pick<File, 'key'>, true>({
  key: Joi.string()
    .trim()
    .regex(/^\w(?:[\w .-]*\w)?\.[\w-]+$/)
    .required()
    .messages({
      'string.empty': FilesValidationErrorMessage.KEY_REQUIRED,
      'string.regex': FilesValidationErrorMessage.INVALID_KEY,
    }),
});

export { filesUpdateKeyRequestBody };
