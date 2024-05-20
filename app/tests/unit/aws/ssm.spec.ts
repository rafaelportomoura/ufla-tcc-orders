/* eslint-disable dot-notation */
import { expect } from 'chai';
import Sinon from 'sinon';
import { SSM } from '../../../src/aws/ssm';

describe('AWS -> SSM', () => {
  beforeEach(Sinon.restore);
  it('Should get', async () => {
    const ssm = new SSM({});
    Sinon.stub(ssm['client'], 'send').resolves({ Parameter: { Value: '{}' } });
    const response = await ssm.getParams('');
    expect(response).deep.eq({});
  });
  it('Should get with decryption', async () => {
    const ssm = new SSM({});
    Sinon.stub(ssm['client'], 'send').resolves({ Parameter: { Value: '{}' } });
    const response = await ssm.getParams('', true);
    expect(response).deep.eq({});
  });
});
