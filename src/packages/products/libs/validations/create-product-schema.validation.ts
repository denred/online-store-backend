import Joi from 'joi';

import { commonProductsSchema } from './common-products-schema.validation.js';
import { quantitySchema } from './product-quantity-schema.validation.js';

const {
  category,
  subcategory,
  title,
  vendorCode,
  colour,
  description,
  composition,
  size,
  price,
  manufacturer,
  brand,
  collection,
  files,
  quantities,
} = commonProductsSchema;

const createProductSchema = Joi.object({
  category: category.required(),
  subcategory: subcategory.required(),
  title: title.required(),
  vendorCode: vendorCode.required(),
  colour: colour.required(),
  description: description.required(),
  composition: composition.required(),
  price: price.required(),
  brand: brand,
  collection: collection,
  manufacturer: manufacturer,
  files: files,
  quantities: quantities,
});

export { createProductSchema };
