import { expect } from 'chai';
import sinon from 'sinon';
import { Logger } from '../../../src/adapters/logger';
import { SendSellEmail } from '../../../src/business/SendSellEmail';
import { ContactBridge } from '../../../src/services/ContactBridge';
import { SendEmailParams } from '../../../src/types/ContactBridge';
import { SendSellEmailArgs } from '../../../src/types/SendSellEmail';

describe('Business -> SendSellEmail', () => {
  let send_sell_email_service: SendSellEmail;
  let contact_bridge_stub: sinon.SinonStubbedInstance<ContactBridge>;
  let logger_stub: sinon.SinonStubbedInstance<Logger>;
  beforeEach(() => {
    contact_bridge_stub = sinon.createStubInstance(ContactBridge);
    logger_stub = sinon.createStubInstance(Logger);
    const args: SendSellEmailArgs = {
      contact: contact_bridge_stub,
      template: 'sellTemplate',
      logger: logger_stub
    };

    send_sell_email_service = new SendSellEmail(args);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('send', () => {
    it('should send a sell email with the correct template and properties', async () => {
      const username = 'testuser';
      const order_id = 'order123';
      const email = 'testuser@example.com';

      contact_bridge_stub.getEmailByUsername.resolves(email);

      const send_email_params: SendEmailParams = {
        properties: { order_id },
        to: [email],
        template: 'sellTemplate'
      };

      await send_sell_email_service.send(username, order_id);

      expect(contact_bridge_stub.getEmailByUsername.calledOnceWith(username)).equal(true);
      expect(contact_bridge_stub.sendEmail.calledOnceWith(send_email_params)).equal(true);
    });
  });
});
