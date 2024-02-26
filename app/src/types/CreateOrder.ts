import { FastifyBaseLogger } from 'fastify';
import { ObjectId } from 'mongoose';
import { z } from 'zod';
import { create_order_body_schema } from '../schemas/create';
import { user_id_schema } from '../schemas/user_id';
import { AwsParams } from './Aws';
import { CodeMessage } from './CodeMessage';
import { Product } from './Products';

export type CreateOrderArgs = {
  aws_params: AwsParams;
  logger: FastifyBaseLogger;
  stock_base_url: string;
  products_base_url: string;
  event_bus_topic: string;
};

export type CreateOrder = z.infer<typeof create_order_body_schema> & z.infer<typeof user_id_schema>;
export type CreateOrderProducts = CreateOrder['products'];

export type OrderInResponse = {
  order_id: ObjectId;
  price_total: number;
  price_per_product: Record<
    Product['_id'],
    {
      price_unit: number;
      quantity: number;
      price_total: number;
    }
  >;
};

export type CreateOrderResponse = CodeMessage & {
  order: OrderInResponse;
};
