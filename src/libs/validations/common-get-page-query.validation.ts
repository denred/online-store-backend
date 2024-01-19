import Joi from 'joi';

import { CommonValidationMessage } from '../enums/enums.js';
import { type PaginatedQuery } from '../types/types.js';

const commonGetPageQuery = Joi.object<PaginatedQuery, true>({
  size: Joi.number().integer().min(0).messages({
    'number.base': CommonValidationMessage.PAGE_SIZE_MUST_BE_NUMBER,
  }),
  page: Joi.number().integer().min(0).messages({
    'number.base': CommonValidationMessage.PAGE_INDEX_MUST_BE_NUMBER,
  }),
  sorting: Joi.string().messages({
    'string.base': CommonValidationMessage.SORTING_MUST_BE_STRING,
  }),
});

export { commonGetPageQuery };
