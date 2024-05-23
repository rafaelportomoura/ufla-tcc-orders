import { expect } from 'chai';
import sinon from 'sinon';
import { Logger } from '../../../src/adapters/logger';
import { SQS } from '../../../src/aws/sqs';
import { ContactBridge } from '../../../src/services/ContactBridge';
import { OAuthService } from '../../../src/services/OAuth';
import { ContactBridgeArgs, SendEmailParams } from '../../../src/types/ContactBridge';
import { UserData } from '../../data/user';

describe('Service -> ContactBridge', () => {
  let contact_bridge: ContactBridge;
  let sqs_stub: sinon.SinonStubbedInstance<SQS>;
  let oauth_stub: sinon.SinonStubbedInstance<OAuthService>;
  let logger_stub: sinon.SinonStubbedInstance<Logger>;

  beforeEach(() => {
    sinon.restore();
    sqs_stub = sinon.createStubInstance(SQS);
    oauth_stub = sinon.createStubInstance(OAuthService);
    logger_stub = sinon.createStubInstance(Logger);

    const args: ContactBridgeArgs = {
      sqs: sqs_stub,
      oauth: oauth_stub,
      logger: logger_stub
    };

    contact_bridge = new ContactBridge(args);
  });

  describe('sendEmail', () => {
    it('should send an email via SQS', async () => {
      const params: SendEmailParams = {
        to: ['recipient@example.com'],
        template: 'templateName',
        properties: { prop1: 'value1' }
      };

      await contact_bridge.sendEmail(params);

      expect(sqs_stub.send.calledOnceWith(params)).equal(true);
    });
  });

  describe('getEmailByUsername', () => {
    it('should return email for given username', async () => {
      const username = 'testuser';
      const email = 'testuser@example.com';
      oauth_stub.get.resolves(UserData.user({ email, username }));

      const result = await contact_bridge.getEmailByUsername(username);

      expect(result).to.equal(email);
      expect(oauth_stub.get.calledOnceWith(username)).equal(true);
    });
  });
});
