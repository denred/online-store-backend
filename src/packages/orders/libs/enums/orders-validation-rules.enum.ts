const OrdersValidationRules = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  ZIP_CODE_MIN_LENGTH: 5,
  ZIP_CODE_MAX_LENGTH: 10,
  MORE_INFO_MAX_LENGTH: 255,
  QUANTITY_MIN: 1,
  PHONE_PATTERN: /^\+\(?(\d{3})\)?([ .-]?)(\d{3})\2(\d{4})/,
} as const;

export { OrdersValidationRules };
