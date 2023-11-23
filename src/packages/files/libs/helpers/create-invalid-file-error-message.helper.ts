import { type MultipartFile } from '@fastify/multipart';

import { FileValidatorError } from '~/libs/exceptions/exceptions.js';
import { type ValueOf } from '~/libs/types/types.js';

import {
  FilesValidationErrorMessage,
  FileValidatorErrorMessage,
} from '../enums/enums.js';
import { type FileInputConfig } from '../types/types.js';
import { filesize, pluralizeString } from './helpers.js';

const createInvalidFileErrorMessage = (
  errorType: ValueOf<typeof FilesValidationErrorMessage>,
  fileInputConfig: Partial<FileInputConfig>,
  file?: MultipartFile,
): string => {
  switch (errorType) {
    case FilesValidationErrorMessage.FILE_TOO_BIG: {
      if (!fileInputConfig.maxSizeBytes) {
        throw new FileValidatorError({
          message: FileValidatorErrorMessage.MAX_SIZE,
        });
      }

      const problemFile = file as MultipartFile;

      return `File '${problemFile.filename}': size must be less than ${filesize(
        fileInputConfig.maxSizeBytes,
      )}`;
    }
    case FilesValidationErrorMessage.TOO_MANY_FILES: {
      if (!fileInputConfig.maxFiles) {
        throw new FileValidatorError({
          message: FileValidatorErrorMessage.MAX_FILES,
        });
      }

      const pluralizedFiles = pluralizeString('file', fileInputConfig.maxFiles);

      return `There can be no more than ${fileInputConfig.maxFiles} ${pluralizedFiles}`;
    }
    case FilesValidationErrorMessage.INVALID_FILE_TYPE: {
      if (!fileInputConfig.accept) {
        throw new FileValidatorError({
          message: FileValidatorErrorMessage.ACCEPT,
        });
      }

      const problemFile = file as MultipartFile;

      const allowedTypes = `type must be ${Object.values(fileInputConfig.accept)
        .flat()
        .join(', ')}`;

      return `File '${problemFile.filename}': ${allowedTypes}`;
    }
    case FilesValidationErrorMessage.INVALID_FILE_NAME: {
      const problemFile = file as MultipartFile;

      return `File '${problemFile.filename}': invalid name.`;
    }
    default: {
      return 'Unexpected error occurred';
    }
  }
};

export { createInvalidFileErrorMessage };
