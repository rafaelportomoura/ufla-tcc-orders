import { FastifyBaseLogger } from 'fastify';
import { aws_config } from '../aws/config';
import { SNS } from '../aws/sns';
import { EVENT } from '../constants/event';
import { AwsParams } from '../types/Aws';
import { EventBusMessageAttributes, EventNotification, EventStatus, EventType } from '../types/EventBus';

export class EventBus {
  private sns: SNS;

  constructor(
    private logger: FastifyBaseLogger,
    private topic: string,
    aws_params: AwsParams
  ) {
    this.sns = new SNS(aws_config(aws_params));
  }

  async pub(body: unknown, message_attributes: EventBusMessageAttributes): Promise<void> {
    this.logger.debug('EventBus.publish(', body, message_attributes, ')');

    const response = await this.sns.pub({
      TopicArn: this.topic,
      Message: JSON.stringify(body),
      MessageAttributes: message_attributes
    });

    this.logger.debug('EventBus.publish ->', response);
  }

  messageAttributes(type: EventType, status: EventStatus, notification?: EventNotification): EventBusMessageAttributes {
    const attribute_value = (v: string) => ({ DataType: 'String', StringValue: v });
    return {
      event: attribute_value(EVENT),
      type: attribute_value(type),
      status: attribute_value(status),
      ...(notification && { notification: attribute_value(notification) })
    };
  }
}
