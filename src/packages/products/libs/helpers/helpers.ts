import { type PaginatedQuery } from '~/libs/types/types.js';

const isObjectEmpty = (object: Record<string, number>): boolean =>
  Object.keys(object).length === 0;

const getSkip = (query: PaginatedQuery): number =>
  isObjectEmpty(query) ? 0 : query.page * query.size;

const getTake = (query: PaginatedQuery, count: number): number =>
  isObjectEmpty(query) ? count : query.size;

const buildId = (payload: string): string =>
  payload && payload.trim().toLowerCase().replaceAll(/[\s-]/g, '_');

export { buildId, getSkip, getTake };