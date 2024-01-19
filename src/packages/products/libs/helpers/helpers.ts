import { type PaginatedQuery } from '~/libs/types/types.js';

const getIsObjectEmpty = (object: PaginatedQuery): boolean =>
  Object.keys(object).length === 0;

const getSkip = (query: PaginatedQuery): number =>
  getIsObjectEmpty(query) ? 0 : Math.max(query.page - 1, 0) * query.size;

const getTake = (query: PaginatedQuery, count: number): number =>
  getIsObjectEmpty(query) ? count : query.size;

const getBuildId = (payload: string): string =>
  payload && payload.trim().toLowerCase().replaceAll(/[\s-]/g, '_');

const getIsNotEmptyString = (value: string): boolean =>
  typeof value === 'string' && value.length > 0;

const getBuildImageName = (title: string, filename: string): string => {
  const formattedTitle = getIsNotEmptyString(title)
    ? title.trim().toLowerCase()
    : '';

  const cleanedFilename = getIsNotEmptyString(title)
    ? filename.replaceAll(/\.[^./]+$/g, '')
    : '';

  return `${formattedTitle.replaceAll(/\s+/g, '-')}-image-${cleanedFilename}`;
};

export { getBuildId, getBuildImageName, getSkip, getTake };
