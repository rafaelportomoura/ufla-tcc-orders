import { expect } from 'chai';
import { request_id } from '../../../src/utils/requestId';
import { fastify_request } from '../../data/fastify';

describe('Utils -> RequestId', () => {
  it('Should get request id by header', () => {
    const response = request_id(fastify_request({ headers: { request_id: 'requestId' } }));
    expect(response).equal('requestId');
  });
  it('Should create request id', () => {
    const response = request_id(fastify_request());
    expect(response.length).equal(24);
  });
});
