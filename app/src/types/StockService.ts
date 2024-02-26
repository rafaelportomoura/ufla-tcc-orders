import { FastifyBaseLogger } from 'fastify';
import { CodeMessage } from './CodeMessage';
import { CreateOrderProducts } from './CreateOrder';

export type StockServiceConstructor = {
  base_url: string;
  logger: FastifyBaseLogger;
};

export type ReserveRequest = {
  products: CreateOrderProducts;
};

export type Reserve = {
  stock_ids: number[];
  quantity: number;
  product_id: number;
};

export type ReserveResponse = CodeMessage & {
  reserves: Reserve[];
};
