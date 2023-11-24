import { type File } from '@prisma/client';

type CreateFileDto = Pick<File, 'contentType' | 'key' | 'name'>;

export { type CreateFileDto };
