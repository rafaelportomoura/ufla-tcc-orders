import { expect } from 'chai';
import sinon from 'sinon';
import { Logger } from '../../../src/adapters/logger';
import { GetOrderBusiness } from '../../../src/business/GetOrder';
import { CODE_MESSAGES } from '../../../src/constants/codeMessages';
import { LoggerLevel } from '../../../src/constants/loggerLevel';
import { NotFoundError } from '../../../src/exceptions/NotFoundError';
import { OrderRepository } from '../../../src/repositories/order';
import { OrderData } from '../../data/order';

describe('Business -> GetOrder', async () => {
  let find_one: sinon.SinonStub;
  let business: GetOrderBusiness;
  beforeEach(() => {
    sinon.restore();
    find_one = sinon.stub(OrderRepository.prototype, 'findOne');
    business = new GetOrderBusiness({ aws_params: {}, logger: new Logger(LoggerLevel.silent, '') });
  });

  it('should get order', async () => {
    const order = OrderData.order();
    find_one.resolves(order);
    const response = await business.get({ order_id: order._id, username: order.username });
    expect(response).deep.equal(order);
  });

  it('should throw NotFoundError when not found order', async () => {
    find_one.resolves();
    const response = await business.get({ order_id: '', username: '' }).catch((c) => c);
    expect(response).deep.equal(new NotFoundError(CODE_MESSAGES.NOT_FOUND_ERROR));
  });
});
