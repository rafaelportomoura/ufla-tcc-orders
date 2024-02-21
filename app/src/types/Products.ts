import { FastifyBaseLogger } from 'fastify';

export type ProductServiceConstructor = {
  base_url: string;
  logger: FastifyBaseLogger;
};

export type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  created_at: Date;
  updated_at: Date;
  status: string;
  images: Array<string>;
};

export type ProductList<T> = {
  products: Array<T>;
};

export type GetProductPrice = Pick<Product, '_id' | 'price'>;
export type GetProductsPrice = Array<GetProductPrice>;
