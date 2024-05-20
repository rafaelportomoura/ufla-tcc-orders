import { AxiosError } from 'axios';
import { expect } from 'chai';
import sinon from 'sinon';
import { Api } from '../../../src/adapters/api';
import { Logger } from '../../../src/adapters/logger';
import { CODE_MESSAGES } from '../../../src/constants/codeMessages';
import { LoggerLevel } from '../../../src/constants/loggerLevel';
import { InternalServerError } from '../../../src/exceptions/InternalServerError';
import { ReserveStockError } from '../../../src/exceptions/ReserveStockError';
import { StockService } from '../../../src/services/Stock';
import { Reserve, ReserveRequest } from '../../../src/types/StockService';
import { OrderData } from '../../data/order';
import { StockData } from '../../data/stock';

describe('Service -> StockService', () => {
  let stock_service: StockService;
  let post_stub: sinon.SinonStub;

  const base_url = 'http://example.com';
  const request_id = 'test-request-id';

  beforeEach(() => {
    post_stub = sinon.stub(Api.prototype, 'post');
    stock_service = new StockService({ base_url, logger: new Logger(LoggerLevel.silent, ''), request_id });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('reserve', () => {
    it('should reserve stock for valid products', async () => {
      const { products } = OrderData.create();
      const reserve_request: ReserveRequest = { products };
      const reserves: Reserve[] = [StockData.reserve()];
      post_stub.resolves({ reserves });

      const result = await stock_service.reserve(reserve_request);

      expect(result).deep.equal(reserves);
      expect(post_stub.calledOnceWith('reserve', { products })).equal(true);
    });

    it('should throw ReserveStockError if some products cannot be reserved', async () => {
      const { products } = OrderData.create();
      const reserve_request: ReserveRequest = { products };
      const error_response = {
        response: {
          data: {
            product_ids: ['1']
          }
        }
      };
      post_stub.rejects(error_response);

      try {
        await stock_service.reserve(reserve_request);
        expect.fail('Should throw ReserveStockError!');
      } catch (error) {
        expect(error).instanceOf(ReserveStockError);
        expect((error as ReserveStockError).product_ids).deep.equal(['1']);
      }

      expect(post_stub.calledOnceWith('reserve', { products: reserve_request.products })).equal(true);
    });

    it('should throw InternalServerError for other API errors', async () => {
      const { products } = OrderData.create();
      const reserve_request: ReserveRequest = { products };
      const error = new AxiosError('API call failed');
      post_stub.rejects(error);

      try {
        await stock_service.reserve(reserve_request);
        expect.fail('Should throw Internal Server Error!');
      } catch (err) {
        expect(err).instanceOf(InternalServerError);
        expect(err).deep.equal(new InternalServerError(CODE_MESSAGES.ERROR_CALLING_RESERVE_STOCK_API));
      }

      expect(post_stub.calledOnceWith('reserve', { products: reserve_request.products })).equal(true);
    });
  });
});
