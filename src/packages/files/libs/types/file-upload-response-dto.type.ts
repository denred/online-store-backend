import { type File } from '@prisma/client';

type FileUploadResponseDto = {
  items: File[];
  totalCount: number;
};

export { type FileUploadResponseDto };
