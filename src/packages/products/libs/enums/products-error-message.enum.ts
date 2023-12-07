import { ProductValidationRules } from './product-validation-rules.enum.js';

const ProductsErrorMessage = {
  INVALID: 'Invalid field',
  ID_INVALID: 'Invalid id',
  REQUIRED: 'This field is mandatory',
  BAD_REQUEST: 'Bad request',
  MAX_LENGTH: `Field should be less than ${ProductValidationRules.MAX_LENGTH} characters long`,
  DESCRIPTION_MAX_LENGTH: `Description should be less than ${ProductValidationRules.DESCRIPTION_MAX_LENGTH} characters long`,
  COMPOSITION_MAX_LENGTH: `Description should be less than ${ProductValidationRules.COMPOSITION_MAX_LENGTH} characters long`,
  PRICE_INVALID: `Price should be a number in a range ${ProductValidationRules.PRICE_MIN} - ${ProductValidationRules.PRICE_MAX}`,
  QUANTITY_INVALID: `Quantity should be a number in a range 0 - ${ProductValidationRules.MAX_QUANTITY}`,
} as const;

export { ProductsErrorMessage };
