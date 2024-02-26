import { z } from 'zod';
import { NUMBER_OPERATORS, OBJECT_OPERATORS, STRING_OPERATORS } from '../constants/search';
import { STATUS } from '../constants/status';
import { pagination_schema, project_schema, search_attribute_schema, sort_schema } from './search';

export const common_search_schema = z.object({
  status: search_attribute_schema(z.enum(STATUS), ...STRING_OPERATORS).optional(),
  products: search_attribute_schema(z.string(), ...OBJECT_OPERATORS),
  price_total: search_attribute_schema(z.number(), ...NUMBER_OPERATORS).optional()
});

export const list_orders_search_schema = common_search_schema.merge(
  z.object({
    user_id: search_attribute_schema(z.string(), ...STRING_OPERATORS).optional()
  })
);

export const list_orders_project_schema = project_schema(
  'products',
  'status',
  'price_total',
  'user_id',
  '_id',
  'created_at',
  'updated_at'
);

export const list_orders_schema = z
  .object({
    search: list_orders_search_schema.optional(),
    project: list_orders_project_schema.optional()
  })
  .merge(pagination_schema)
  .merge(sort_schema(['created_at', 'updated_at', 'status', 'user_id']));
