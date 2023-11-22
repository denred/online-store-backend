import {
  type Multipart,
  type MultipartFields,
  type MultipartFile,
  type MultipartValue,
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

    const isArrayName = fieldName.includes('[]');
    const fieldArrayTyped = field as Multipart[];

    if (isArrayName) {
      const fieldNameWithoutBrackets = fieldName.split('[]')[0];
      const isActualArray = Array.isArray(field);

      if (isActualArray) {
        const isFileArray = fieldArrayTyped[0].type === 'file';
        parsedBody[fieldNameWithoutBrackets] = isFileArray
          ? fieldArrayTyped
          : (fieldArrayTyped as MultipartValue[]).map(
              (arrayElement) => arrayElement.value,
            );
        continue;
      }
      const isFileArray = field.type === 'file';
      parsedBody[fieldNameWithoutBrackets] = isFileArray
        ? [field]
        : [field.value];
      continue;
    }
    parsedBody[fieldName] = (field as MultipartValue).value;
  }

  return parsedBody;
};

export { parseFormDataFields };
