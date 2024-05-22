/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import { FastifyReply } from 'fastify';
import sinon from 'sinon';
import { RejectBusiness } from '../../../src/business/Reject';
import { CODE_MESSAGES } from '../../../src/constants/codeMessages';
import { reject } from '../../../src/controllers/reject';
import { InternalServerError } from '../../../src/exceptions/InternalServerError';
import { fastify_reply, fastify_request, fastify_stub } from '../../data/fastify';
import { OrderData } from '../../data/order';

describe('Controller -> Reject', async () => {
  let business: sinon.SinonStub;
  let res: Record<keyof FastifyReply, sinon.SinonStub>;
  const controller = (body: Record<string, unknown>) => reject(fastify_request({ body }), fastify_reply(res));
  beforeEach(() => {
    sinon.restore();
    business = sinon.stub(RejectBusiness.prototype, 'reject');
    res = fastify_stub();
    sinon.stub(console, 'log');
  });
  it('should list', async () => {
    business.resolves();
    const response = await controller({ order_id: OrderData._id() });
    expect(res.status.args).deep.equal([[200]]);
    expect(response).deep.equal(CODE_MESSAGES.REJECTED);
  });
  it('should not list', async () => {
    business.rejects(new Error());
    const response = await controller({ order_id: OrderData._id() });
    expect(res.status.args).deep.equal([[500]]);
    expect(response).deep.equal(new InternalServerError(CODE_MESSAGES.INTERNAL_SERVER_ERROR).toJSON());
  });
});
