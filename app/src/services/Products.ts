import { FastifyBaseLogger } from 'fastify';
import { Api } from '../adapters/api';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { InternalServerError } from '../exceptions/InternalServerError';
import { ProductsNotFound } from '../exceptions/ProductNotFound';
import { GetProductPrice, GetProductsPrice, Product, ProductList, ProductServiceConstructor } from '../types/Products';

export class ProductsService {
  private api: Api;

  private logger: FastifyBaseLogger;

  constructor({ base_url, logger }: ProductServiceConstructor) {
    this.logger = logger;
    this.api = new Api({ baseURL: base_url });
  }

  async getProductsPrice(product_ids: Array<Product['_id']>): Promise<GetProductsPrice> {
    const { products } = await this.list<GetProductPrice>({
      price: 1,
      search: { _id: { in: product_ids } }
    });
    if (products.length < product_ids.length)
      throw new ProductsNotFound(products.filter(({ _id }) => !product_ids.includes(_id)).map(({ _id }) => _id));
    return products;
  }

  async list<T>(query: Record<string, unknown>): Promise<ProductList<T>> {
    try {
      const response = await this.api.get<ProductList<T>>('', query);

      return response;
    } catch (error) {
      this.logger.error(error, 'Products.list');

      throw new InternalServerError(CODE_MESSAGES.ERROR_CALLING_LIST_PRODUCT_API);
    }
  }
}
