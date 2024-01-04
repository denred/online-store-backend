const HttpMessage = {
  FILE_DOES_NOT_EXIST: 'File does not exist!',
  PRODUCT_DOES_NOT_EXIST: 'Product with such id does not exist!',
  INVALID_ID: 'Products id is not valid!',
  USER_EMAIL_EXISTS: 'A user with this email already exists.',
  USER_PHONE_EXISTS: 'A user with this phone number already exists.',
} as const;

export { HttpMessage };
