import { z } from 'zod';
import { common_search_schema, list_orders_project_schema } from './list';
import { pagination_schema, sort_schema } from './search';

export const list_user_orders_schema = z
  .object({
    search: common_search_schema.default({}),
    project: list_orders_project_schema.optional()
  })
  .merge(pagination_schema)
  .merge(sort_schema(['created_at', 'updated_at', 'status']));
