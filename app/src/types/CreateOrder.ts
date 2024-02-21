import { FastifyBaseLogger } from 'fastify';
import { AwsParams } from './Aws';

export type CreateOrderArgs = {
  aws_params: AwsParams;
  logger: FastifyBaseLogger;
  stock_base_url: string;
  products_base_url: string;
};

export type CreateOrderProducts = {
  product_id: string;
  quantity: number;
};

export type CreateOrder = {
  products: Record<string, number>;
  user_id: string;
};
