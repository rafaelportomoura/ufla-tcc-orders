import { Api } from '../adapters/api';
import { Logger } from '../adapters/logger';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { OPERATOR } from '../constants/search';
import { InternalServerError } from '../exceptions/InternalServerError';
import { ProductsNotFound } from '../exceptions/ProductNotFound';
import {
  GetProductPrice,
  GetProductsPrice,
  ListProductsQuery,
  Product,
  ProductList,
  ProductServiceConstructor
} from '../types/Products';

export class ProductsService {
  private api: Api;

  private logger: Logger;

  constructor({ base_url, logger, request_id }: ProductServiceConstructor) {
    this.logger = logger;
    this.api = new Api(request_id, { baseURL: base_url });
  }

  async getProductsPrice(product_ids: Array<Product['_id']>): Promise<GetProductsPrice> {
    const { products } = await this.list<GetProductPrice>({
      project: { price: 1, _id: 1 },
      search: { _id: { [OPERATOR.IN]: product_ids } },
      page: 1,
      size: product_ids.length
    });
    this.logger.info('ProductsService.getProductsPrice', { product_ids, products });
    if (products.length < product_ids.length)
      throw new ProductsNotFound(product_ids.filter((id) => products.every(({ _id }) => _id !== id)));
    return products;
  }

  async list<T>(query: ListProductsQuery): Promise<ProductList<T>> {
    try {
      const response = await this.api.get<ProductList<T>>('', query);

      return response;
    } catch (error) {
      this.logger.error('Products.list', error.message, error?.response?.data, error);

      throw new InternalServerError(CODE_MESSAGES.ERROR_CALLING_LIST_PRODUCT_API);
    }
  }
}
