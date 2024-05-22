/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import { FastifyReply } from 'fastify';
import sinon from 'sinon';
import { ListOrders } from '../../../src/business/List';
import { CODE_MESSAGES } from '../../../src/constants/codeMessages';
import { list } from '../../../src/controllers/list';
import { InternalServerError } from '../../../src/exceptions/InternalServerError';
import { fastify_reply, fastify_request, fastify_stub } from '../../data/fastify';
import { OrderData } from '../../data/order';
import { SearchData } from '../../data/search';

describe('Controller -> List', async () => {
  let business: sinon.SinonStub;
  let res: Record<keyof FastifyReply, sinon.SinonStub>;
  const controller = (query: Record<string, unknown>) => list(fastify_request({ query }), fastify_reply(res));
  beforeEach(() => {
    sinon.restore();
    business = sinon.stub(ListOrders.prototype, 'list');
    res = fastify_stub();
    sinon.stub(console, 'log');
  });
  it('should list', async () => {
    const order = OrderData.listResponse();
    business.resolves(order);
    const response = await controller(SearchData.filter());
    expect(res.status.args).deep.equal([[200]]);
    expect(response).deep.equal(order);
  });
  it('should not list', async () => {
    business.rejects(new Error());
    const response = await controller(SearchData.filter());
    expect(res.status.args).deep.equal([[500]]);
    expect(response).deep.equal(new InternalServerError(CODE_MESSAGES.INTERNAL_SERVER_ERROR).toJSON());
  });
});
