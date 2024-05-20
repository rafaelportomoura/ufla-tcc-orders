/* eslint-disable import/no-extraneous-dependencies */
import { SNSEventRecord, SQSRecord } from 'aws-lambda';

export class SqsData {
  static record(body: unknown): SQSRecord {
    return {
      messageId: 'OK',
      body: JSON.stringify(body)
    } as SQSRecord;
  }

  static snsBody(body: unknown): SNSEventRecord['Sns'] {
    return {
      Message: JSON.stringify(body),
      MessageId: 'OK',
      TopicArn: 'arn:aws:sns:us-east-1:123456789012:MyTopic'
    } as SNSEventRecord['Sns'];
  }
}
