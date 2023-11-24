import { type ValueOf } from '~/libs/types/types.js';
import { type FilesValidationStrategy } from '~/packages/files/files.js';
import { type FileInputConfig } from '~/packages/files/libs/types/types.js';

type ValidateFilesStrategyOptions = {
  strategy: ValueOf<typeof FilesValidationStrategy>;
  filesInputConfig: FileInputConfig;
};

export { type ValidateFilesStrategyOptions };
