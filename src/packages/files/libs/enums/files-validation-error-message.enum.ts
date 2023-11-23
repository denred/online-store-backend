const FilesValidationErrorMessage = {
  TOO_MANY_FILES: 'too_many_files',
  FILE_TOO_BIG: 'file_too_big',
  INVALID_FILE_TYPE: 'invalid_file_type',
  INVALID_FILE_NAME: 'invalid_file_name',
  INVALID_KEY: 'File key is invalid file name!',
  KEY_REQUIRED: 'File key is required!',
  ID_REQUIRED: 'Id of file record is required!',
} as const;

export { FilesValidationErrorMessage };
