import { SQSEvent, SQSRecord } from 'aws-lambda';
import { expect } from 'chai';
import sinon from 'sinon';
import { Logger } from '../../../src/adapters/logger';
import { Validator } from '../../../src/adapters/validate';
import { SendSellEmail } from '../../../src/business/SendSellEmail';
import { sell } from '../../../src/handlers/sell';
import { sell_schema } from '../../../src/schemas/sell';
import { Order } from '../../../src/types/Order';
import { OrderData } from '../../data/order';

describe('Handler -> sell', () => {
  let event: SQSEvent;
  let record: SQSRecord;
  let validator_spy: sinon.SinonSpy;
  let send_sell_email_stub: sinon.SinonStub;
  let validated_body: unknown;
  let order: Order;
  let stock_ids: number[];

  const str_and_parse = (v: unknown) => JSON.parse(JSON.stringify(v));

  beforeEach(() => {
    sinon.restore();
    order = OrderData.order();
    stock_ids = [1, 2, 3];
    validated_body = str_and_parse({ stock_ids, order });
    record = {
      messageId: '1',
      receiptHandle: 'handle',
      body: JSON.stringify(validated_body),
      attributes: {},
      messageAttributes: {},
      md5OfBody: '',
      eventSource: 'aws:sqs',
      eventSourceARN: '',
      awsRegion: 'us-east-1'
    } as SQSRecord;
    event = { Records: [record] } as SQSEvent;
    validator_spy = sinon.spy(Validator, 'validate');
    send_sell_email_stub = sinon.stub(SendSellEmail.prototype, 'send');
    sinon.stub(Logger.prototype, 'debug');
    sinon.stub(Logger.prototype, 'error');
  });

  it('should process the SQS event and send a sell email', async () => {
    await sell(event);

    expect(validator_spy.args).deep.equal([[validated_body, sell_schema]]);
    expect(send_sell_email_stub.calledOnceWith(order.username, order._id)).equal(true);
  });

  it('should process the SQS event and send a sell email', async () => {
    event.Records[0].body = JSON.stringify({
      TopicArn: 'arn',
      Message: JSON.stringify(validated_body)
    });
    await sell(event);

    expect(validator_spy.args).deep.equal([[validated_body, sell_schema]]);
    expect(send_sell_email_stub.calledOnceWith(order.username, order._id)).equal(true);
  });

  it('should log an error if processing fails', async () => {
    const error = new Error('Test error');
    send_sell_email_stub.rejects(error);

    try {
      await sell(event);
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});
