import sinon from 'sinon';
import { Api } from '../../../src/adapters/api';
import { Logger } from '../../../src/adapters/logger';
import { LoggerLevel } from '../../../src/constants/loggerLevel';
import { ProductsService } from '../../../src/services/Products';

describe('Service -> Product', async () => {
  let api_get: sinon.SinonStub;
  let products: ProductsService;
  beforeEach(() => {
    sinon.restore();
    api_get = sinon.stub(Api.prototype, 'get');
    products = new ProductsService({
      base_url: 'base_url',
      logger: new Logger(LoggerLevel.silent, ''),
      request_id: 'req'
    });
  });
});
