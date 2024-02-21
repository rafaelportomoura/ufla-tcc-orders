import { FastifyBaseLogger } from 'fastify';
import { CodeMessage } from './CodeMessage';

export type StockServiceConstructor = {
  base_url: string;
  logger: FastifyBaseLogger;
};

export type ReserveRequest = {
  products: Record<string, number>;
};

export type Reserve = {
  stock_ids: number[];
  quantity: number;
  product_id: number;
};

export type ReserveResponse = CodeMessage & {
  reserved: Reserve[];
};
