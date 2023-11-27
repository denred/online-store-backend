import {
  type Multipart,
  type MultipartFields,
  type MultipartFile,
} from '@fastify/multipart';
import { type FastifyRequest } from 'fastify';

const parseFormDataFields = (
  request: FastifyRequest,
): Record<string, unknown> & { files: MultipartFile[] } => {
  const parsedBody = {} as Record<string, unknown> & { files: MultipartFile[] };

  for (const [fieldName, field] of Object.entries(
    request.body as MultipartFields,
  )) {
    if (!field) {
      continue;
    }

    const fieldArrayTyped = field as Multipart[];

    if (Array.isArray(field)) {
      const isFileArray = fieldArrayTyped.every((item) => item.type === 'file');

      parsedBody[fieldName] = isFileArray
        ? fieldArrayTyped
        : fieldArrayTyped.map((arrayElement) => ({
            filename: arrayElement.fieldname,
            mimetype: arrayElement.mimetype,
          }));
    } else {
      parsedBody[fieldName] = [
        {
          ...field,
        },
      ];
    }
  }

  return parsedBody;
};

export { parseFormDataFields };
