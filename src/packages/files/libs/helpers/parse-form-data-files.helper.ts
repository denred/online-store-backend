import { type MultipartFile } from '@fastify/multipart';

import {
  type FileInputConfig,
  type MultipartParsedFile,
} from '../types/types.js';
import { checkFileName } from './check-file-name.helper.js';
import { checkFileSize } from './check-file-size.helper.js';
import { checkFileType } from './check-file-type.helper.js';
import { checkFilesCount } from './check-files-count.helper.js';

const parseFormDataFiles = async ({
  parsedFields,
  fileInputConfig,
}: {
  parsedFields: {
    files: MultipartFile[];
  };
  fileInputConfig: Partial<FileInputConfig>;
}): Promise<MultipartParsedFile[]> => {
  const parsedBodyFiles: MultipartParsedFile[] = [];

  let filesCount = 0;

  for await (const temporaryFile of parsedFields.files) {
    filesCount++;

    checkFilesCount(fileInputConfig, filesCount);

    checkFileName(fileInputConfig, temporaryFile);

    const actualMimeType = checkFileType(fileInputConfig, temporaryFile);

    const bufferedContent = await checkFileSize(fileInputConfig, temporaryFile);

    const validatedFile = {
      content: bufferedContent,
      mimetype: actualMimeType,
      fieldname: temporaryFile.fieldname,
      filename: temporaryFile.filename,
      encoding: temporaryFile.encoding,
    } as MultipartParsedFile;

    parsedBodyFiles.push(validatedFile);
  }

  return parsedBodyFiles;
};

export { parseFormDataFiles };
