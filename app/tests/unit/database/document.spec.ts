/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { expect } from 'chai';
import mongoose from 'mongoose';
import Sinon from 'sinon';
import { Logger } from '../../../src/adapters/logger';
import { SecretsManager } from '../../../src/aws/secretsManager';
import { SSM } from '../../../src/aws/ssm';
import { CODE_MESSAGES } from '../../../src/constants/codeMessages';
import { LoggerLevel } from '../../../src/constants/loggerLevel';
import { DocumentDatabase } from '../../../src/database/document';
import { DatabaseError } from '../../../src/exceptions/DatabaseError';
import { DocumentDatabaseData } from '../../data/database';

describe('Database -> Document', () => {
  let secret_manager: Sinon.SinonStub;
  let ssm: Sinon.SinonStub;
  const aws_params = { region: 'us-east-1' };
  let document: DocumentDatabase;
  let mongoose_connect: Sinon.SinonStub;
  let disconnect: Sinon.SinonStub;

  beforeEach(() => {
    Sinon.restore();
    document = new DocumentDatabase(aws_params, new Logger(LoggerLevel.silent, ''));
    secret_manager = Sinon.stub(SecretsManager.prototype, 'getSecret');
    ssm = Sinon.stub(SSM.prototype, 'getParams');
    mongoose_connect = Sinon.stub(mongoose, 'connect').resolves();
    disconnect = Sinon.stub(mongoose, 'disconnect').resolves();
  });

  it('should do nothing when already connected', async () => {
    (mongoose.connection as any)['readyState'] = 1;

    await document.connect();

    expect(mongoose_connect.called).equal(false);
    expect(ssm.called).equal(false);
    expect(secret_manager.called).equal(false);
  });

  it('should connect with informed params', async () => {
    (mongoose.connection as any)['readyState'] = 0;

    const secret = DocumentDatabaseData.secret();
    const params = DocumentDatabaseData.params();
    await document.connect(secret, params);

    expect(mongoose_connect.called).equal(true);
    expect(ssm.called).equal(false);
    expect(secret_manager.called).equal(false);
  });

  it('should get params and connect', async () => {
    (mongoose.connection as any)['readyState'] = 0;
    ssm.resolves(DocumentDatabaseData.params({ options: {} }));
    secret_manager.resolves(DocumentDatabaseData.secret());

    await document.connect();

    expect(mongoose_connect.called).equal(true);
    expect(ssm.called).equal(true);
    expect(secret_manager.called).equal(true);
  });

  it('should throw error when cannot connect', async () => {
    (mongoose.connection as any)['readyState'] = 0;
    secret_manager.throws(new Error('Error'));

    const result = await document.connect().catch((e) => e);

    expect(result).deep.equal(new DatabaseError(CODE_MESSAGES.CANNOT_ACCESS_DATABASE));
    expect(mongoose_connect.called).equal(false);
    expect(ssm.called).equal(false);
    expect(secret_manager.called).equal(true);
  });

  it('should disconnect', async () => {
    await document.disconnect();

    expect(disconnect.called).equal(true);
  });
});
