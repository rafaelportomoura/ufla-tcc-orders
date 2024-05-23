import { SQS } from '../aws/sqs';
import { ContactBridgeArgs, SendEmailParams } from '../types/ContactBridge';
import { OAuthService } from './OAuth';

export class ContactBridge {
  private sqs: SQS;

  private oauth: OAuthService;

  constructor(args: ContactBridgeArgs) {
    this.sqs = args.sqs;
    this.oauth = args.oauth;
  }

  async sendEmail(params: SendEmailParams): Promise<void> {
    await this.sqs.send(params);
  }

  async getEmailByUsername(username: string): Promise<string> {
    const { email } = await this.oauth.get(username);
    return email;
  }
}
