import { InvalidFileError } from '~/libs/exceptions/exceptions.js';

import { FilesValidationErrorMessage } from '../enums/enums.js';
import { type FileInputConfig, type MultipartFile } from '../types/types.js';
import { createInvalidFileErrorMessage } from './create-invalid-file-error-message.helper.js';

const checkFileSize = async (
  fileInputConfig: Partial<FileInputConfig>,
  temporaryFile: MultipartFile,
): Promise<Buffer> => {
  const bufferedContent = await temporaryFile.toBuffer();

  if (
    fileInputConfig.maxSizeBytes &&
    bufferedContent.length > fileInputConfig.maxSizeBytes
  ) {
    const message = createInvalidFileErrorMessage(
      FilesValidationErrorMessage.FILE_TOO_BIG,
      fileInputConfig,
      temporaryFile,
    );

    throw new InvalidFileError({ message });
  }

  return bufferedContent;
};

export { checkFileSize };
