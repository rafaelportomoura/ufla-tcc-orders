import { expect } from 'chai';
import sinon from 'sinon';
import { Api } from '../../../src/adapters/api';
import { Logger } from '../../../src/adapters/logger';
import { CODE_MESSAGES } from '../../../src/constants/codeMessages';
import { LoggerLevel } from '../../../src/constants/loggerLevel';
import { OPERATOR } from '../../../src/constants/search';
import { InternalServerError } from '../../../src/exceptions/InternalServerError';
import { ProductsNotFound } from '../../../src/exceptions/ProductNotFound';
import { ProductsService } from '../../../src/services/Products';
import { ListProductsQuery, Product, ProductList } from '../../../src/types/Products';
import { ProductData } from '../../data/product';

describe('Service -> Products', () => {
  let products_service: ProductsService;
  let get_stub: sinon.SinonStub;
  const base_url = 'http://example.com';
  const request_id = 'test-request-id';

  beforeEach(() => {
    sinon.restore();
    get_stub = sinon.stub(Api.prototype, 'get');
    products_service = new ProductsService({ base_url, logger: new Logger(LoggerLevel.silent, ''), request_id });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('getProductsPrice', () => {
    it('should return product prices for valid product IDs', async () => {
      const product_ids = ['1', '2', '3'];
      const products = product_ids.map((id) => ({ _id: id, price: 100 }));
      const response = { products };
      const list_stub = sinon.stub(products_service, 'list').resolves(response);

      const result = await products_service.getProductsPrice(product_ids);

      expect(result).to.deep.equal(products);
      expect(
        list_stub.calledOnceWith({
          project: { price: 1, _id: 1 },
          search: { _id: { [OPERATOR.IN]: product_ids } },
          page: 1,
          size: product_ids.length
        })
      ).equal(true);
    });

    it('should throw ProductsNotFound if some product IDs are not found', async () => {
      const product_ids = ['1', '2', '3'];
      const products = [{ _id: '1', price: 100 }];
      const response = { products };
      const list_stub = sinon.stub(products_service, 'list').resolves(response);

      try {
        await products_service.getProductsPrice(product_ids);
      } catch (error) {
        expect(error).to.be.instanceOf(ProductsNotFound);
        expect(error.message).to.equal('Product(s) not found!');
        expect(error.product_ids).to.deep.equal(['2', '3']);
      }

      expect(
        list_stub.calledOnceWith({
          project: { price: 1, _id: 1 },
          search: { _id: { [OPERATOR.IN]: product_ids } },
          page: 1,
          size: product_ids.length
        })
      ).equal(true);
    });
  });

  describe('list', () => {
    it('should return product list for valid query', async () => {
      const query: ListProductsQuery = { page: 1, size: 10 };
      const response: ProductList<Product> = { products: [ProductData.product()] };
      get_stub.resolves(response);

      const result = await products_service.list<Product>(query);

      expect(result).to.deep.equal(response);
      expect(get_stub.calledOnceWith('', query)).equal(true);
    });

    it('should throw InternalServerError if API call fails', async () => {
      const query: ListProductsQuery = { page: 1, size: 10 };
      const error = new Error('API call failed');
      get_stub.rejects(error);

      try {
        await products_service.list<Product>(query);
      } catch (err) {
        expect(err).to.be.instanceOf(InternalServerError);
        expect(err.message).to.equal(CODE_MESSAGES.ERROR_CALLING_LIST_PRODUCT_API.message);
      }

      expect(get_stub.calledOnceWith('', query)).equal(true);
    });
  });
});
