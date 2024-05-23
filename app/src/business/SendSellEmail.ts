import { ContactBridge } from '../services/SendEmail';
import { SendSellEmailArgs } from '../types/SendSellEmail';

export class SendSellEmail {
  private contact_bridge: ContactBridge;

  private template: string;

  constructor(args: SendSellEmailArgs) {
    this.contact_bridge = args.contact;
    this.template = args.template;
  }

  async send(username: string, properties: Record<string, unknown>): Promise<void> {
    await this.contact_bridge.sendEmail({
      properties,
      to: [await this.contact_bridge.getEmailByUsername(username)],
      template: this.template
    });
  }
}
