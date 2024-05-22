/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import { FastifyReply } from 'fastify';
import sinon from 'sinon';
import { CreateOrderBusiness } from '../../../src/business/Create';
import { CODE_MESSAGES } from '../../../src/constants/codeMessages';
import { create } from '../../../src/controllers/create';
import { InternalServerError } from '../../../src/exceptions/InternalServerError';
import { fastify_reply, fastify_request, fastify_stub } from '../../data/fastify';
import { OrderData } from '../../data/order';

describe('Controller -> Create', async () => {
  let business: sinon.SinonStub;
  let res: Record<keyof FastifyReply, sinon.SinonStub>;
  const controller = (body: Record<string, unknown>, headers: any) =>
    create(fastify_request({ body, headers }), fastify_reply(res));
  beforeEach(() => {
    sinon.restore();
    business = sinon.stub(CreateOrderBusiness.prototype, 'create');
    res = fastify_stub();
    sinon.stub(console, 'log');
  });
  it('should create', async () => {
    const order = OrderData.order();
    business.resolves(order);
    const { username, products } = OrderData.create();
    const response = await controller({ products }, { username });
    expect(res.status.args).deep.equal([[201]]);
    expect(response).deep.equal({ order: OrderData.orderInResponse(order), ...CODE_MESSAGES.CREATE_ORDER });
  });
  it('should create', async () => {
    const order = OrderData.order({ products: {} });
    business.resolves(order);
    const { username, products } = OrderData.create();
    const response = await controller({ products }, { username });
    expect(res.status.args).deep.equal([[201]]);
    expect(response).deep.equal({ order: OrderData.orderInResponse(order), ...CODE_MESSAGES.CREATE_ORDER });
  });
  it('should not create', async () => {
    business.rejects(new Error());
    const { username, products } = OrderData.create();
    const response = await controller({ products }, { username });
    expect(res.status.args).deep.equal([[500]]);
    expect(response).deep.equal(new InternalServerError(CODE_MESSAGES.INTERNAL_SERVER_ERROR));
  });
});
