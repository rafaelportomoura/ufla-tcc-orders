import { isEmpty } from 'lodash';
import { FilterQuery } from 'mongoose';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { OPERATORS_MAP_TO_MONGO, SORT } from '../constants/search';
import { BadRequestError } from '../exceptions/BadRequestError';
import { ListInfo } from '../types/List';
import { SearchOptions, SearchPaginationAndSort, SearchQuery, SearchSchema } from '../types/Search';

export class Search<T> {
  createQuery(search?: SearchSchema): SearchQuery<T> {
    const query: SearchQuery<T> = {};

    if (isEmpty(search)) return query;

    for (const [key, filters] of Object.entries(search)) {
      query[key as keyof FilterQuery<T>] = {};
      for (const [operator, value] of Object.entries(filters)) {
        query[key as keyof FilterQuery<T>] = {
          ...query[key],
          ...OPERATORS_MAP_TO_MONGO[operator as keyof typeof OPERATORS_MAP_TO_MONGO](value as string)
        };
      }
    }

    return query;
  }

  createOptions({ sort: query_sort, sort_by, page, size }: SearchPaginationAndSort): SearchOptions {
    const sort = { [sort_by]: SORT[query_sort] };
    const limit = size;
    const skip = (page - 1) * size;

    return { sort, limit, skip };
  }

  listInfo({ count, skip, page, size }: { count: number; skip: number; page: number; size: number }): ListInfo {
    if (count < skip) throw new BadRequestError(CODE_MESSAGES.INVALID_PAGE);
    const pages = Math.ceil(count / size);
    return { pages, count, page };
  }
}
