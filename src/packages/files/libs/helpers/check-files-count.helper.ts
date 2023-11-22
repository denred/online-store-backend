import { InvalidFileError } from '~/libs/exceptions/exceptions.js';

import { FilesValidationErrorMessage } from '../enums/enums.js';
import { type FileInputConfig } from '../types/types.js';
import { createInvalidFileErrorMessage } from './create-invalid-file-error-message.helper.js';

const checkFilesCount = (
  fileInputConfig: Partial<FileInputConfig>,
  filesCount: number,
): void => {
  if (fileInputConfig.maxFiles && filesCount > fileInputConfig.maxFiles) {
    const message = createInvalidFileErrorMessage(
      FilesValidationErrorMessage.TOO_MANY_FILES,
      fileInputConfig,
    );

    throw new InvalidFileError({ message });
  }
};

export { checkFilesCount };
