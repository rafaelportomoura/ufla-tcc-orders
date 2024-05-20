import { Axios } from 'axios';
import { expect } from 'chai';
import sinon from 'sinon';
import { Api } from '../../../src/adapters/api';

describe('Adapter -> Api', async () => {
  let post_stub: sinon.SinonStub;
  let get_stub: sinon.SinonStub;
  let api: Api;

  beforeEach(() => {
    sinon.restore();
    post_stub = sinon.stub(Axios.prototype, 'post');
    get_stub = sinon.stub(Axios.prototype, 'get');
    api = new Api('req', { baseURL: 'http://localhost' });
  });

  it('should call post method', async () => {
    post_stub.resolves({ data: 'data' });
    const response = await api.post('url', { data: 'data' });
    expect(response).deep.equal('data');
  });
  it('should call get method', async () => {
    get_stub.resolves({ data: 'data' });
    const response = await api.get('url');
    expect(response).deep.equal('data');
  });
  it('should call get method with query string', async () => {
    get_stub.resolves({ data: 'data' });
    const response = await api.get(undefined, { a: 'b' });
    expect(response).deep.equal('data');
    expect(get_stub.args[0][0]).deep.equal('?a=b');
  });
});
