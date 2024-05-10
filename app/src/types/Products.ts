import { Logger } from '../adapters/logger';
import { PRODUCT_SORT_BY } from '../constants/search';
import { Sort, SortBy } from './Search';

export type ProductServiceConstructor = {
  base_url: string;
  logger: Logger;
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

export type ListProductsQuery = { [k in keyof Product]?: Product[k] } & {
  project?: Partial<Record<keyof Product, 1 | 0>>;
  search?: Partial<Record<keyof Product, unknown>> | undefined;
  page?: number;
  size?: number;
  order?: Sort;
  sort_by?: SortBy<typeof PRODUCT_SORT_BY>;
};

export type ProductsWithProject<T extends ListProductsQuery> = {
  [k in keyof T['project'] & keyof Product]: Product[k];
};
