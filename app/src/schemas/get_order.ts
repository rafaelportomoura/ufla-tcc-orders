import { order_id_schema } from './order_id';
import { username_schema } from './username';

export const get_order_schema = username_schema.merge(order_id_schema);
