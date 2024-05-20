import { expect } from 'chai';
import sinon from 'sinon';
import { Logger } from '../../../src/adapters/logger';
import { SNS } from '../../../src/aws/sns';
import { EVENT, EVENT_STATUS, EVENT_TYPE } from '../../../src/constants/event';
import { LoggerLevel } from '../../../src/constants/loggerLevel';
import { EventBus } from '../../../src/services/EventBus';

describe('Service -> EventBus', () => {
  let sns: sinon.SinonStub;
  let debug: sinon.SinonStub;
  let event_bus: EventBus;
  const topic = 'test';
  beforeEach(() => {
    sinon.restore();
    sns = sinon.stub(SNS.prototype, 'pub').resolves();
    event_bus = new EventBus(new Logger(LoggerLevel.silent, 'test'), topic, { region: 'us-east-1' });
    debug = sinon.stub(Logger.prototype, 'debug').returns();
  });

  it('Should create message attributes', async () => {
    const message_attributes = event_bus.messageAttributes(EVENT_TYPE.CREATE, EVENT_STATUS.SUCCESS);
    expect(message_attributes).deep.equal({
      event: { DataType: 'String', StringValue: EVENT },
      type: { DataType: 'String', StringValue: EVENT_TYPE.CREATE },
      status: { DataType: 'String', StringValue: EVENT_STATUS.SUCCESS }
    });
  });

  it('Should publish event', async () => {
    const attributes = event_bus.messageAttributes(EVENT_TYPE.CREATE, EVENT_STATUS.SUCCESS);
    const body = { test: 'test' };
    await event_bus.pub(body, attributes);
    expect(sns.calledOnce).equal(true);
    expect(debug.calledTwice).equal(true);
    expect(sns.args[0]).deep.equal([{ TopicArn: topic, Message: JSON.stringify(body), MessageAttributes: attributes }]);
    expect(debug.args[0]).deep.equal(['EventBus.publish(', body, attributes, ')']);
    expect(debug.args[1]).deep.equal(['EventBus.publish ->', undefined]);
  });
});
