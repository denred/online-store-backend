import { type DropzoneOptions } from 'react-dropzone';

type FileInputConfig = Pick<
  DropzoneOptions,
  'multiple' | 'maxFiles' | 'accept'
> & { maxSizeBytes?: number; minSizeBytes?: number };

export { type FileInputConfig };
