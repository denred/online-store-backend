import { type ProductSortParameter } from '../enums/enums.js';
import { type ValueOf } from './value-of.type.js';

type PaginatedQuery = {
  page: number;
  size: number;
  sorting?: ValueOf<typeof ProductSortParameter>;
};

export { type PaginatedQuery };
