/* eslint-disable import/no-extraneous-dependencies */
import { SNSEventRecord, SQSEvent } from 'aws-lambda';
import { Logger } from '../adapters/logger';
import { Validator } from '../adapters/validate';
import { aws_config, aws_params } from '../aws/config';
import { SQS } from '../aws/sqs';
import { SendSellEmail } from '../business/SendSellEmail';
import { CONFIGURATION } from '../constants/configuration';
import { URLS } from '../constants/urls';
import { sell_schema } from '../schemas/sell';
import { OAuthService } from '../services/OAuth';
import { ContactBridge } from '../services/SendEmail';
import { sqs_request_id } from '../utils/sqs_id';

export async function sell(event: SQSEvent): Promise<void> {
  const record = event.Records[0];
  const request_id = sqs_request_id(record);
  const logger = new Logger(CONFIGURATION.LOG_LEVEL, request_id);
  try {
    let body = JSON.parse(record.body);
    if ((body as SNSEventRecord['Sns']).TopicArn) body = JSON.parse(body.Message);
    const { stock_ids, order } = await Validator.validate(body, sell_schema);
    const sqs = new SQS(CONFIGURATION.EMAIL_SQS, aws_config(aws_params()));
    const business = new SendSellEmail({
      contact: new ContactBridge({
        sqs,
        logger,
        oauth: new OAuthService(request_id, { baseURL: URLS(CONFIGURATION).OAUTH })
      }),
      logger,
      template: CONFIGURATION.SELL_TEMPLATE
    });
    await business.send(order.username, { stock_ids, order });
  } catch (error) {
    logger.error('Handler', error.message, error);
    throw error;
  }
}
