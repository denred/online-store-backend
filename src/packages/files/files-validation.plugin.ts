import { type MultipartFile } from '@fastify/multipart';
import { type FastifyReply, type FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

import { type HttpError } from '~/libs/exceptions/exceptions.js';

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
  fastify.decorateRequest('parsedFiles', []);

  fastify.decorate(
    FilesValidationStrategy.BASIC,
    (fileInputConfig: FileInputConfig) =>
      async (
        request: FastifyRequest,
        _: FastifyReply,
        done: (error?: Error) => void,
      ): Promise<void> => {
        const parsedFields = parseFormDataFields(request);

        try {
          const parsedFiles = await parseFormDataFiles({
            parsedFields: parsedFields as { files: MultipartFile[] },
            fileInputConfig,
          });
          request.body = { ...parsedFields, files: parsedFiles };
          request.parsedFiles = parsedFiles;
        } catch (error) {
          return done(error as HttpError);
        }
      },
  );

  done();
});

export { filesValidationPlugin };
