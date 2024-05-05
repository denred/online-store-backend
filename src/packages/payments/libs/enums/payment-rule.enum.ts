const PaymentRule = {
  MONTH: { MIN: 1, MAX: 12 },
  YEAR: { MIN: new Date().getFullYear(), MAX: new Date().getFullYear() + 10 },
  CVV: { MIN: 100, MAX: 999 },
} as const;

export { PaymentRule };
