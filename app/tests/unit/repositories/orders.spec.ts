import { expect } from 'chai';
import sinon from 'sinon';
import { Logger } from '../../../src/adapters/logger';
import { LoggerLevel } from '../../../src/constants/loggerLevel';
import { STATUS_MAP } from '../../../src/constants/status';
import { DocumentDatabase } from '../../../src/database/document';
import { order_model } from '../../../src/entities/order';
import { OrderRepository } from '../../../src/repositories/order';
import { Order, OrderStatus, RawOrder } from '../../../src/types/Order';
import { OrderData } from '../../data/order';

describe('OrderRepository', () => {
  let repository: OrderRepository;
  let create_stub: sinon.SinonStub;
  let connect_stub: sinon.SinonStub;
  let disconnect_stub: sinon.SinonStub;
  let count_documents_stub: sinon.SinonStub;
  let find_one_and_update_stub: sinon.SinonStub;
  let find_stub: sinon.SinonStub;
  let find_one_stub: sinon.SinonStub;

  const logger = new Logger(LoggerLevel.silent, 'test-request-id');

  beforeEach(() => {
    sinon.restore();
    const model = order_model();
    repository = new OrderRepository({}, logger);
    create_stub = sinon.stub(model, 'create');
    connect_stub = sinon.stub(DocumentDatabase.prototype, 'connect');
    disconnect_stub = sinon.stub(DocumentDatabase.prototype, 'disconnect');
    count_documents_stub = sinon.stub(model, 'countDocuments');
    find_one_and_update_stub = sinon.stub(model, 'findOneAndUpdate');
    find_stub = sinon.stub(model, 'find');
    find_one_stub = sinon.stub(model, 'findOne');
  });

  it('should create an order', async () => {
    const payload: RawOrder = OrderData.raw();
    const order = OrderData.order(payload);
    create_stub.resolves(order);
    connect_stub.resolves();

    const result = await repository.create(payload);

    expect(result).to.deep.equal(order);
    expect(create_stub.calledOnceWith(payload)).equal(true);
  });

  it('should count orders', async () => {
    const query = { status: STATUS_MAP.PENDING };
    count_documents_stub.resolves(5);
    connect_stub.resolves();

    const result = await repository.count(query);

    expect(result).to.equal(5);
    expect(count_documents_stub.calledOnceWith(query)).equal(true);
  });

  it('should change the status of an order', async () => {
    const order_id = '1';
    const status: OrderStatus = STATUS_MAP.APPROVED;
    const updated_order = OrderData.order({ status });
    find_one_and_update_stub.resolves(updated_order);
    connect_stub.resolves();

    const result = await repository.changeStatus(order_id, status);

    expect(result).to.deep.equal(updated_order);
    expect(find_one_and_update_stub.calledOnceWith({ _id: order_id }, { status }, { new: true, lean: true })).equal(
      true
    );
  });

  it('should find orders', async () => {
    const query = { status: OrderData.status() };
    const orders: Order[] = [OrderData.order()];
    find_stub.resolves(
      orders.map((v) => ({
        toObject() {
          return v;
        }
      }))
    );
    connect_stub.resolves();

    const result = await repository.find(query);

    expect(result).to.deep.equal(orders);
    expect(find_stub.calledOnceWith(query, {}, {})).equal(true);
  });

  it('should find orders with lean', async () => {
    const query = { status: OrderData.status() };
    const orders: Order[] = [OrderData.order()];
    find_stub.resolves(orders);
    connect_stub.resolves();

    const result = await repository.find(query, {}, { lean: true });

    expect(result).to.deep.equal(orders);
    expect(find_stub.calledOnceWith(query, {}, {})).equal(true);
  });

  it('should find one order', async () => {
    const query = { _id: OrderData._id() };
    const order = OrderData.order(query);
    find_one_stub.resolves({
      toObject() {
        return order;
      }
    });
    connect_stub.resolves();

    const result = await repository.findOne(query);

    expect(result).to.deep.equal(order);
    expect(find_one_stub.calledOnceWith(query, {}, {})).equal(true);
  });
  it('should find one order with lean', async () => {
    const query = { _id: OrderData._id() };
    const order = OrderData.order(query);
    find_one_stub.resolves(order);
    connect_stub.resolves();

    const result = await repository.findOne(query, {}, { lean: true });

    expect(result).to.deep.equal(order);
    expect(find_one_stub.calledOnceWith(query, {}, {})).equal(true);
  });

  it('should disconnect', async () => {
    disconnect_stub.resolves();

    const result = await repository.disconnect();

    expect(result).to.deep.equal(undefined);
  });
});
