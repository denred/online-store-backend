import Joi from 'joi';

import { commonProductsSchema } from './common-products-schema.validation.js';

const updateProductSchema = Joi.object({
  ...commonProductsSchema,
});

export { updateProductSchema };
