import { SQSRecord } from 'aws-lambda';
import { expect } from 'chai';
import { sqs_request_id } from '../../../src/utils/sqs_id';

describe('Utils -> SqsId', async () => {
  it('Should be messageId at catch', async () => {
    const result = sqs_request_id({ messageId: 'OK' } as SQSRecord);
    expect(result).equal('OK');
  });
  it('Should be messageId and has attributes at catch', async () => {
    const result = sqs_request_id({ messageId: 'OK', attributes: {} } as SQSRecord);
    expect(result).equal('OK');
  });
  it('Should be deduplicationId at catch', async () => {
    const result = sqs_request_id({ attributes: { MessageDeduplicationId: 'dedu' }, messageId: 'OK' } as SQSRecord);
    expect(result).equal('dedu');
  });
  it('Should be messageId', async () => {
    const result = sqs_request_id({ messageId: 'OK', body: '{}' } as SQSRecord);
    expect(result).equal('OK');
  });
  it('Should be messageId and has attributes', async () => {
    const result = sqs_request_id({ messageId: 'OK', body: '{}', attributes: {} } as SQSRecord);
    expect(result).equal('OK');
  });
  it('Should be deduplicationId', async () => {
    const result = sqs_request_id({
      body: '{}',
      attributes: { MessageDeduplicationId: 'dedu' },
      messageId: 'OK'
    } as SQSRecord);
    expect(result).equal('dedu');
  });
  it('Should be sns message id', async () => {
    const result = sqs_request_id({
      body: '{"MessageId": "sns"}',
      attributes: { MessageDeduplicationId: 'dedu' },
      messageId: 'OK'
    } as SQSRecord);
    expect(result).equal('sns');
  });
});
