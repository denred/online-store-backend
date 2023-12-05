const PASSWORD_LENGTH_MIN = 6;
const PASSWORD_LENGTH_MAX = 20;
const AuthValidationRules = {
  PASSWORD_PATTERN: `^(?=.*[a-z])(?=.*\\d)[\\dA-Za-z]{${PASSWORD_LENGTH_MIN},${PASSWORD_LENGTH_MAX}}$`,
} as const;

export { AuthValidationRules, PASSWORD_LENGTH_MAX, PASSWORD_LENGTH_MIN };
