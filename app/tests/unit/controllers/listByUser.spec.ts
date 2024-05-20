/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import { FastifyReply } from 'fastify';
import sinon from 'sinon';
import { ListOrders } from '../../../src/business/List';
import { CODE_MESSAGES } from '../../../src/constants/codeMessages';
import { listByUser } from '../../../src/controllers/listByUser';
import { InternalServerError } from '../../../src/exceptions/InternalServerError';
import { fastify_reply, fastify_request, fastify_stub } from '../../data/fastify';
import { OrderData } from '../../data/order';
import { SearchData } from '../../data/search';

describe('Controller -> ListByUser', async () => {
  let business: sinon.SinonStub;
  let res: Record<keyof FastifyReply, sinon.SinonStub>;
  const controller = (query: Record<string, unknown>, params: Record<string, unknown>) =>
    listByUser(fastify_request({ query, params }), fastify_reply(res));
  beforeEach(() => {
    sinon.restore();
    business = sinon.stub(ListOrders.prototype, 'list');
    res = fastify_stub();
    sinon.stub(console, 'log');
  });
  it('should list', async () => {
    const order = OrderData.listResponse();
    business.resolves(order);
    const response = await controller(SearchData.filter(), { user_id: 'x' });
    expect(res.status.args).deep.equal([[200]]);
    expect(response).deep.equal(order);
  });
  it('should not list', async () => {
    business.rejects(new Error());
    const response = await controller(SearchData.filter(), { user_id: 'x' });
    expect(res.status.args).deep.equal([[500]]);
    expect(response).deep.equal(new InternalServerError(CODE_MESSAGES.INTERNAL_SERVER_ERROR));
  });
});
