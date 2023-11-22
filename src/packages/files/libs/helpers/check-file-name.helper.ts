import { InvalidFileError } from '~/libs/exceptions/exceptions.js';

import { FilesValidationErrorMessage } from '../enums/enums.js';
import { type FileInputConfig, type MultipartFile } from '../types/types.js';
import { checkValidFileName } from './check-valid-file-name.helper.js';
import { createInvalidFileErrorMessage } from './create-invalid-file-error-message.helper.js';

const checkFileName = (
  fileInputConfig: Partial<FileInputConfig>,
  temporaryFile: MultipartFile,
): void => {
  const isValidFilename = checkValidFileName(temporaryFile.filename);

  if (!isValidFilename) {
    const message = createInvalidFileErrorMessage(
      FilesValidationErrorMessage.INVALID_FILE_NAME,
      fileInputConfig,
      temporaryFile,
    );

    throw new InvalidFileError({ message });
  }
};

export { checkFileName };
