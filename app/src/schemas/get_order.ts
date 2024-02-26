import { order_id_schema } from './order_id';
import { user_id_schema } from './user_id';

export const get_order_schema = user_id_schema.merge(order_id_schema);
