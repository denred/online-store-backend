const PasswordLimits = {
  MIN_LENGTH: 6,
  MAX_LENGTH: 20,
} as const;

const UsersValidationRules = {
  EMAIL_MAX_LENGTH: 80,
  PHONE_PATTERN: /^\+(?:\d{1,4}\s?)?\d{7,11}$/,
  PASSWORD_PATTERN: `^(?=.*[a-z])(?=.*\\d)[\\dA-Za-z]{${PasswordLimits.MIN_LENGTH},${PasswordLimits.MAX_LENGTH}}$`,
} as const;

export { PasswordLimits };
export { UsersValidationRules };
