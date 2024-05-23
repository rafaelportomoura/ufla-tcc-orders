/* eslint-disable snakecasejs/snakecasejs */
/* eslint-disable import/no-extraneous-dependencies */

import { SNSEventRecord, SQSRecord } from 'aws-lambda';

export const sqs_request_id = ({ attributes, messageId, body }: SQSRecord): string => {
  try {
    const { MessageId } = JSON.parse(body) as SNSEventRecord['Sns'];
    return MessageId ?? attributes?.MessageDeduplicationId ?? messageId;
  } catch (error) {
    return attributes?.MessageDeduplicationId ?? messageId;
  }
};
