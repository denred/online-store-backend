import { lookup } from 'mime-types';

import { InvalidFileError } from '~/libs/exceptions/exceptions.js';

import { FilesValidationErrorMessage } from '../enums/enums.js';
import { type FileInputConfig, type MultipartFile } from '../types/types.js';
import { createInvalidFileErrorMessage } from './create-invalid-file-error-message.helper.js';

const checkFileType = (
  fileInputConfig: Partial<FileInputConfig>,
  temporaryFile: MultipartFile,
): string | null => {
  const fileMimeType = lookup(temporaryFile.filename);

  if (fileInputConfig.accept) {
    const matchedType = Object.entries(fileInputConfig.accept).some(
      ([mimeType]) => fileMimeType === mimeType,
    );

    if (!matchedType) {
      const message = createInvalidFileErrorMessage(
        FilesValidationErrorMessage.INVALID_FILE_TYPE,
        fileInputConfig,
        temporaryFile,
      );

      throw new InvalidFileError({ message });
    }
  }

  return fileMimeType || null;
};

export { checkFileType };
