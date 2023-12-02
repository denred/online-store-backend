import Joi from 'joi';

const getStringValidationSchema = (message: string): Joi.StringSchema =>
  Joi.string().required().messages({
    'string': message,
  });

export { getStringValidationSchema };
