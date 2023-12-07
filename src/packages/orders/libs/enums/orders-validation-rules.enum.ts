const OrdersValidationRules = {
  ZIP_CODE_LENGTH: 5,
  MORE_INFO_MAX_LENGTH: 255,
  MIN_QUANTITY: 1,
  PHONE_PATTERN: /^\+\(?(\d{3})\)?([ .-]?)(\d{3})\2(\d{4})/,
  ZIP_CODE_PATTERN: /\d{5}/,
} as const;

export { OrdersValidationRules };
