const ProductValidationRules = {
  MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 1000,
  COMPOSITION_MAX_LENGTH: 800,
  PRICE_MIN: 1,
  PRICE_MAX: 10_000,
} as const;

export { ProductValidationRules };
