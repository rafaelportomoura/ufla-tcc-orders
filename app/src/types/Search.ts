import { FilterQuery } from 'mongoose';
import { ZodTypeAny, z } from 'zod';
import { OPERATORS, SORT, SORT_KEYS } from '../constants/search';
import { pagination_schema, project_schema, search_attribute_schema, sort_schema } from '../schemas/search';

export type Operator = (typeof OPERATORS)[number];
export type SortBy<T extends readonly unknown[]> = T[number];
export type Sort = (typeof SORT_KEYS)[number];
export type MongoSort = (typeof SORT)[Sort];

export type SearchAttributeSchema<T extends ZodTypeAny, O extends [Operator, ...Operator[]]> = ReturnType<
  typeof search_attribute_schema<T, O>
>;

export type SearchSchema = Record<string, z.infer<SearchAttributeSchema<ZodTypeAny, [Operator, ...Operator[]]>>>;

export type ProjectQuery<T extends [string, ...string[]]> = z.infer<ReturnType<typeof project_schema<T>>>;

export type SortQuery<T extends [string, ...string[]] = [string, ...string[]]> = z.infer<
  ReturnType<typeof sort_schema<T>>
>;

export type PaginationQuery = z.infer<typeof pagination_schema>;

export type SearchOptions = {
  sort: Record<string, MongoSort>;
  limit: number;
  skip: number;
};

export type SearchPaginationAndSort = SortQuery & PaginationQuery;

export type SearchQuery<T> = FilterQuery<T>;
