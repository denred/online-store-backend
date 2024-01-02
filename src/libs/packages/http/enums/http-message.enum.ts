const HttpMessage = {
  FILE_DOES_NOT_EXIST: 'File does not exist!',
  PRODUCT_DOES_NOT_EXIST: 'Product with such id does not exist!',
  INVALID_ID: 'Products id is not valid!',
  USER_EMAIL_EXISTS: 'A user with this email already exists.',
  USER_PHONE_EXISTS: 'A user with this phone number already exists.',
  UNAUTHORIZED: 'You are not authorized.',
  INVALID_JWT: 'Invalid JWT payload.',
  WRONG_EMAIL: 'User with such email is not registered',
  WRONG_PASSWORD: 'Entered invalid password',
  INVALID_GOOGLE_TOKEN: 'Failed to obtain valid tokens.',
} as const;

export { HttpMessage };
