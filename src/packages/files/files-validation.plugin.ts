import { type MultipartFile } from '@fastify/multipart';
import { type FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

import { FilesValidationStrategy } from './libs/enums/enums.js';
import {
  parseFormDataFields,
  parseFormDataFiles,
} from './libs/helpers/helpers.js';
import {
  type FileInputConfig,
  type MultipartParsedFile,
} from './libs/types/types.js';

declare module 'fastify' {
  interface FastifyRequest {
    parsedFiles?: MultipartParsedFile[];
  }
}

const filesValidationPlugin = fp((fastify, _, done) => {
  fastify.addHook('onRequest', async (request: FastifyRequest) => {
    await Promise.resolve();
    request.parsedFiles = [];

    done();
  });

  fastify.decorate(
    FilesValidationStrategy.BASIC,
    (fileInputConfig: FileInputConfig) =>
      async (request: FastifyRequest): Promise<void> => {
        const parsedFields = parseFormDataFields(request);

        const parsedFiles = await parseFormDataFiles({
          parsedFields: parsedFields as { files: MultipartFile[] },
          fileInputConfig,
        });
        request.body = { ...parsedFields, files: parsedFiles };
        request.parsedFiles = parsedFiles;
      },
  );

  done();
});

export { filesValidationPlugin };
