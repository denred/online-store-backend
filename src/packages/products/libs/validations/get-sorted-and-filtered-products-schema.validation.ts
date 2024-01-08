import Joi from 'joi';

import { type GetFilteredProductRequestDto } from '../types/types.js';

const getSortedAndFilteredProductsSchema = Joi.object<
  GetFilteredProductRequestDto,
  true
>({
  colures: Joi.array().items(Joi.string()),
  sizes: Joi.array().items(Joi.string()),
  priceRange: Joi.object({
    min: Joi.number().integer().min(0),
    max: Joi.number().integer().min(0),
  }),
});

export { getSortedAndFilteredProductsSchema };
