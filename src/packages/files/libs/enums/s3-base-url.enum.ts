const S3BaseURL = {
  PATH_SEPARATOR: '/',
  BUCKET_NAME_TAG: '{bucket-name}',
  S3_BASE_URL_TEMPLATE: 'https://{bucket-name}.s3.amazonaws.com',
} as const;

export { S3BaseURL };
