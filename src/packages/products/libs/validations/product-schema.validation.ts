import { Category, Colour, Size, Subcategory } from '@prisma/client';
import Joi from 'joi';

const productSchema = Joi.object({
  id: Joi.string(),
  category: Joi.string()
    .valid(...Object.values(Category))
    .required(),
  subcategory: Joi.string()
    .valid(...Object.values(Subcategory))
    .required(),
  title: Joi.string().required(),
  colour: Joi.string()
    .valid(...Object.values(Colour))
    .required(),
  description: Joi.string().required(),
  composition: Joi.string().required(),
  size: Joi.array()
    .items(Joi.string().valid(...Object.values(Size)))
    .required(),
  price: Joi.number().required(),
  brand: Joi.string(),
  collection: Joi.string(),
  manufacturer: Joi.string(),
  images: Joi.array().items(Joi.string()),
  reviews: Joi.array().items(
    Joi.object({
      id: Joi.string(),
      text: Joi.string().required(),
      rating: Joi.number().required(),
      productId: Joi.string().required(),
    }),
  ),
});

export { productSchema };
