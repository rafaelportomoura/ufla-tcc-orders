import { expect } from 'chai';
import sinon from 'sinon';
import { Logger } from '../../../src/adapters/logger';
import { ApproveBusiness } from '../../../src/business/Approve';
import { CODE_MESSAGES } from '../../../src/constants/codeMessages';
import { LoggerLevel } from '../../../src/constants/loggerLevel';
import { STATUS_MAP } from '../../../src/constants/status';
import { BadRequestError } from '../../../src/exceptions/BadRequestError';
import { NotFoundError } from '../../../src/exceptions/NotFoundError';
import { OrderRepository } from '../../../src/repositories/order';
import { EventBus } from '../../../src/services/EventBus';

describe('Business -> Approve', () => {
  let approve_business: ApproveBusiness;
  let find_one: sinon.SinonStub;
  let change_status: sinon.SinonStub;
  let event_bus: sinon.SinonStub;

  beforeEach(() => {
    sinon.restore();
    approve_business = new ApproveBusiness({
      aws_params: {},
      logger: new Logger(LoggerLevel.silent, ''),
      event_bus_topic: 'test'
    });
    find_one = sinon.stub(OrderRepository.prototype, 'findOne');
    change_status = sinon.stub(OrderRepository.prototype, 'changeStatus');
    event_bus = sinon.stub(EventBus.prototype, 'pub');
  });

  it('should throw NotFoundError if order is not found', async () => {
    find_one.resolves(null);
    const response = await approve_business.approve({ order_id: '1' }).catch((e) => e);
    expect(response).deep.equal(new NotFoundError(CODE_MESSAGES.NOT_FOUND_ERROR));
  });

  it('should throw BadRequestError if order status is not PENDING', async () => {
    find_one.resolves({ status: STATUS_MAP.APPROVED });
    const response = await approve_business.approve({ order_id: '1' }).catch((e) => e);
    expect(response).deep.equal(new BadRequestError(CODE_MESSAGES.CANT_CHANGE_STATUS));
  });

  it('should change order status to APPROVED and publish event', async () => {
    const order = { status: STATUS_MAP.PENDING, products: {} };
    find_one.resolves(order);
    change_status.resolves({ ...order, status: STATUS_MAP.APPROVED });
    await approve_business.approve({ order_id: '1' });
    sinon.assert.calledWith(change_status, '1', STATUS_MAP.APPROVED);
    sinon.assert.calledOnce(event_bus);
  });
});
