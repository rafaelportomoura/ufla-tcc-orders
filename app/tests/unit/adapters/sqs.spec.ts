/* eslint-disable dot-notation */
import { expect } from 'chai';
import Sinon from 'sinon';
import { SQS } from '../../../src/aws/sqs';

describe('AWS -> SQS', () => {
  beforeEach(Sinon.restore);
  it('Should send', async () => {
    const sqs = new SQS('', {});
    Sinon.stub(sqs['client'], 'send').resolves({});
    const response = await sqs.send({ Message: '' });
    expect(response).deep.eq({});
  });
});
