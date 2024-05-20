/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import { FastifyReply } from 'fastify';
import sinon from 'sinon';
import { GetOrderBusiness } from '../../../src/business/GetOrder';
import { CODE_MESSAGES } from '../../../src/constants/codeMessages';
import { get } from '../../../src/controllers/get';
import { InternalServerError } from '../../../src/exceptions/InternalServerError';
import { fastify_reply, fastify_request, fastify_stub } from '../../data/fastify';
import { OrderData } from '../../data/order';

describe('Controller -> Get', async () => {
  let business: sinon.SinonStub;
  let res: Record<keyof FastifyReply, sinon.SinonStub>;
  const controller = (params: Record<string, unknown>) => get(fastify_request({ params }), fastify_reply(res));
  beforeEach(() => {
    sinon.restore();
    business = sinon.stub(GetOrderBusiness.prototype, 'get');
    res = fastify_stub();
    sinon.stub(console, 'log');
  });
  it('should get', async () => {
    const order = OrderData.order();
    business.resolves(order);
    const response = await controller(OrderData.get());
    expect(res.status.args).deep.equal([[200]]);
    expect(response).deep.equal(order);
  });
  it('should not get', async () => {
    business.rejects(new Error());
    const response = await controller(OrderData.get());
    expect(res.status.args).deep.equal([[500]]);
    expect(response).deep.equal(new InternalServerError(CODE_MESSAGES.INTERNAL_SERVER_ERROR));
  });
});
