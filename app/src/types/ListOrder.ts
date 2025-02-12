import { z } from 'zod';
import { Logger } from '../adapters/logger';
import { list_orders_schema } from '../schemas/list';
import { AwsParams } from './Aws';
import { ListResponse, ListType } from './List';
import { Order } from './Order';

export type ListOrders = ListType<'orders', Order>;

export type ListOrdersResponse = ListResponse<ListOrders>;

export type ListOrdersArgs = {
  aws_params: AwsParams;
  logger: Logger;
};

export type ListOrdersQuery = z.infer<typeof list_orders_schema>;
