/* eslint-disable dot-notation */
import { expect } from 'chai';
import Sinon from 'sinon';
import { SecretsManager } from '../../../src/aws/secretsManager';

describe('AWS -> SecretManager', () => {
  beforeEach(Sinon.restore);
  it('Should get a secret', async () => {
    const secret_manager = new SecretsManager({});
    Sinon.stub(secret_manager['client'], 'send').resolves({
      SecretString: JSON.stringify({ secret: 'value' })
    });
    const response = await secret_manager.getSecret('secret_path');
    expect(response).deep.eq({ secret: 'value' });
  });
});
