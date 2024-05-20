import { expect } from 'chai';
import { FastifyReply } from 'fastify';
import sinon from 'sinon';
import { ApproveBusiness } from '../../../src/business/Approve';
import { CODE_MESSAGES } from '../../../src/constants/codeMessages';
import { approve } from '../../../src/controllers/approve';
import { InternalServerError } from '../../../src/exceptions/InternalServerError';
import { fastify_reply, fastify_request, fastify_stub } from '../../data/fastify';
import { OrderData } from '../../data/order';

describe('Controller -> Approve', async () => {
  let business: sinon.SinonStub;
  let res: Record<keyof FastifyReply, sinon.SinonStub>;
  const controller = (body: Record<string, unknown>) => approve(fastify_request({ body }), fastify_reply(res));
  beforeEach(() => {
    sinon.restore();
    business = sinon.stub(ApproveBusiness.prototype, 'approve');
    res = fastify_stub();
    sinon.stub(console, 'log');
  });
  it('should approve', async () => {
    business.resolves();
    const response = await controller({ order_id: OrderData._id() });
    expect(res.status.args).deep.equal([[200]]);
    expect(response).deep.equal(CODE_MESSAGES.APPROVED);
  });
  it('should not approve', async () => {
    business.rejects(new Error());
    const response = await controller({ order_id: OrderData._id() });
    expect(res.status.args).deep.equal([[500]]);
    expect(response).deep.equal(new InternalServerError(CODE_MESSAGES.INTERNAL_SERVER_ERROR));
  });
});
