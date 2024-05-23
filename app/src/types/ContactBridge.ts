import { Logger } from '../adapters/logger';
import { SQS } from '../aws/sqs';
import { OAuthService } from '../services/OAuth';

export type ContactBridgeArgs = {
  sqs: SQS;
  logger: Logger;
  oauth: OAuthService;
};

export type SendEmailParams = {
  to: string[];
  properties?: Record<string, unknown>;
  encrypted_properties?: Record<string, unknown>;
  template: string;
};
