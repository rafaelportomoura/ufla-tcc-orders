import { expect } from 'chai';
import sinon from 'sinon';
import { Logger } from '../../../src/adapters/logger';
import { ListOrders } from '../../../src/business/List';
import { LoggerLevel } from '../../../src/constants/loggerLevel';
import { SORT_KEY } from '../../../src/constants/search';
import { OrderRepository } from '../../../src/repositories/order';
import { ListOrdersQuery } from '../../../src/types/ListOrder';
import { OrderData } from '../../data/order';
import { ProductData } from '../../data/product';

describe('Business -> List', async () => {
  let count: sinon.SinonStub;
  let find: sinon.SinonStub;
  let business: ListOrders;

  beforeEach(() => {
    sinon.restore();
    count = sinon.stub(OrderRepository.prototype, 'count');
    find = sinon.stub(OrderRepository.prototype, 'find');
    business = new ListOrders({ aws_params: {}, logger: new Logger(LoggerLevel.silent, '') });
  });

  it('should filter by products', async () => {
    const filter: ListOrdersQuery = {
      search: {
        products: {
          has: [ProductData._id()]
        }
      },
      sort: SORT_KEY.ASC,
      sort_by: '',
      page: 1,
      size: 10
    };
    const order = OrderData.order();
    count.resolves(1);
    find.resolves([order]);
    const response = await business.list(filter);
    expect(response).deep.equal({
      page: 1,
      pages: 1,
      count: 1,
      orders: [order]
    });
  });

  it('should not filter by products', async () => {
    const filter: ListOrdersQuery = {
      search: {
        products: {
          has: ProductData._id() as unknown as string[]
        }
      },
      sort: SORT_KEY.ASC,
      sort_by: '',
      page: 1,
      size: 10
    };
    const order = OrderData.order();
    count.resolves(1);
    find.resolves([order]);
    const response = await business.list(filter);
    expect(response).deep.equal({
      page: 1,
      pages: 1,
      count: 1,
      orders: [order]
    });
  });
  it('should not filter', async () => {
    const filter: ListOrdersQuery = {
      sort: SORT_KEY.ASC,
      sort_by: '',
      page: 1,
      size: 10
    };
    const order = OrderData.order();
    count.resolves(1);
    find.resolves([order]);
    const response = await business.list(filter);
    expect(response).deep.equal({
      page: 1,
      pages: 1,
      count: 1,
      orders: [order]
    });
  });
});
