import { Logger } from '../adapters/logger';
import { ContactBridge } from '../services/SendEmail';

export type SendSellEmailArgs = {
  contact: ContactBridge;
  logger: Logger;
  template: string;
};
