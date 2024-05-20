/* eslint-disable dot-notation */
import { expect } from 'chai';
import Sinon from 'sinon';
import { SNS } from '../../../src/aws/sns';

describe('AWS -> SNS', () => {
  beforeEach(Sinon.restore);
  it('Should publish', async () => {
    const sns = new SNS({});
    Sinon.stub(sns['client'], 'send').resolves({});
    const response = await sns.pub({ Message: '' });
    expect(response).deep.eq({});
  });
});
