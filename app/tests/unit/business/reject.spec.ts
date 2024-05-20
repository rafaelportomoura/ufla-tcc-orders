import { expect } from 'chai';
import sinon from 'sinon';
import { Logger } from '../../../src/adapters/logger';
import { RejectBusiness } from '../../../src/business/Reject';
import { CODE_MESSAGES } from '../../../src/constants/codeMessages';
import { LoggerLevel } from '../../../src/constants/loggerLevel';
import { STATUS_MAP } from '../../../src/constants/status';
import { BadRequestError } from '../../../src/exceptions/BadRequestError';
import { NotFoundError } from '../../../src/exceptions/NotFoundError';
import { OrderRepository } from '../../../src/repositories/order';
import { EventBus } from '../../../src/services/EventBus';
import { OrderData } from '../../data/order';

describe('Business -> Reject', async () => {
  let find_one: sinon.SinonStub;
  let change_status: sinon.SinonStub;
  let business: RejectBusiness;
  let event_bus: sinon.SinonStub;
  beforeEach(() => {
    sinon.restore();
    find_one = sinon.stub(OrderRepository.prototype, 'findOne');
    change_status = sinon.stub(OrderRepository.prototype, 'changeStatus');
    event_bus = sinon.stub(EventBus.prototype, 'pub');
    business = new RejectBusiness({ aws_params: {}, logger: new Logger(LoggerLevel.silent, ''), event_bus_topic: '' });
  });

  it('should throw NotFoundError if order is not found', async () => {
    find_one.resolves(null);
    const response = await business.reject({ order_id: '1' }).catch((e) => e);
    expect(response).deep.equal(new NotFoundError(CODE_MESSAGES.NOT_FOUND_ERROR));
  });

  it('should throw BadRequestError if order status is not PENDING', async () => {
    find_one.resolves({ status: STATUS_MAP.APPROVED });
    const response = await business.reject({ order_id: '1' }).catch((e) => e);
    expect(response).deep.equal(new BadRequestError(CODE_MESSAGES.CANT_CHANGE_STATUS));
  });

  it('should change order status to.REJECTED and publish event', async () => {
    const order = { status: STATUS_MAP.PENDING, products: {} };
    find_one.resolves(order);
    change_status.resolves({ ...order, status: STATUS_MAP.REJECTED });
    await business.reject({ order_id: '1' });
    sinon.assert.calledWith(change_status, '1', STATUS_MAP.REJECTED);
    sinon.assert.calledOnce(event_bus);
  });

  it('should change order status to.REJECTED and publish event', async () => {
    const order = OrderData.order({ status: STATUS_MAP.PENDING });
    find_one.resolves(order);
    change_status.resolves({ ...order, status: STATUS_MAP.REJECTED });
    await business.reject({ order_id: '1' });
    sinon.assert.calledWith(change_status, '1', STATUS_MAP.REJECTED);
    sinon.assert.calledOnce(event_bus);
  });
});
