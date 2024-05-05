const ErrorMessage = {
  CARD_NUMBER_REQUIRED: 'Card number is required',
  CARD_HOLDER_REQUIRED: 'Card holder is required',
  MONTH_REQUIRED: 'Month is required',
  YEAR_REQUIRED: 'Year is required',
  CVV_REQUIRED: 'CVV is required',
  CARD_NUMBER_INVALID: 'Card number is invalid',
  CARD_HOLDER_INVALID: 'Card holder is invalid',
  MONTH_INVALID: 'Month is invalid',
  YEAR_INVALID: 'Year is invalid',
  CVV_INVALID: 'CVV is invalid',
  CARD_NUMBER_MIN_LENGTH: 'Card number is too short',
  CARD_NUMBER_MAX_LENGTH: 'Card number is too long',
  ORDER_ID_INVALID: 'Order id is invalid',
} as const;

export { ErrorMessage };
