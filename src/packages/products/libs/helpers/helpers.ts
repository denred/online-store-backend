import { type PaginatedQuery } from '~/libs/types/types.js';

const isObjectEmpty = (object: Record<string, number>): boolean =>
  Object.keys(object).length === 0;

const getSkip = (query: PaginatedQuery): number =>
  isObjectEmpty(query) ? 0 : query.page * query.size;

const getTake = (query: PaginatedQuery, count: number): number =>
  isObjectEmpty(query) ? count : query.size;

const isNotEmptyString = (value: string): boolean =>
  typeof value === 'string' && value.length > 0;

const buildImageName = (title: string, filename: string): string => {
  const formattedTitle = isNotEmptyString(title)
    ? title.trim().toLowerCase()
    : '';

  const cleanedFilename = isNotEmptyString(title)
    ? filename.replaceAll(/\.[^./]+$/g, '')
    : '';

  return `${formattedTitle.replaceAll(/\s+/g, '-')}-image-${cleanedFilename}`;
};

export { buildImageName, getSkip, getTake };
