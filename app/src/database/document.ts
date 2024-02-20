/* eslint-disable no-empty-function */
import { FastifyBaseLogger } from 'fastify';
import { isEmpty } from 'lodash';
import mongoose from 'mongoose';
import qs from 'qs';
import { aws_config } from '../aws/config';
import { SecretsManager } from '../aws/secretsManager';
import { SSM } from '../aws/ssm';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { CONFIGURATION } from '../constants/configuration';
import { DatabaseError } from '../exceptions/DatabaseError';
import { AwsParams } from '../types/Aws';
import { DocumentParams, DocumentSecret } from '../types/DocumentSecret';

export class DocumentDatabase {
  private secret_manager: SecretsManager;

  private ssm: SSM;

  constructor(
    config: AwsParams,
    private logger: FastifyBaseLogger
  ) {
    this.secret_manager = new SecretsManager(aws_config(config));
    this.ssm = new SSM(aws_config(config));
  }

  async connect(params_secret?: DocumentSecret, document_params?: DocumentParams) {
    try {
      if (mongoose.connection.readyState) return;

      let secrets = params_secret;
      if (isEmpty(secrets)) {
        secrets = await this.secret_manager.getSecret<DocumentSecret>(CONFIGURATION.DOCUMENT_SECRET);
      }

      let params = document_params;
      if (isEmpty(params)) {
        params = await this.ssm.getParams<DocumentParams>(CONFIGURATION.DOCUMENT_PARAMS);
      }

      const { password, username } = secrets;
      const { protocol, host, database, options } = params;

      const query = !isEmpty(options) ? `?${qs.stringify(options)}` : '';

      const uri = `${protocol}://${username}:${password}@${host}${query}`;

      await mongoose.connect(uri, {
        dbName: database,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 360000
      });
    } catch (error) {
      this.logger.error(error, 'DatabaseError');
      throw new DatabaseError(CODE_MESSAGES.CANNOT_ACCESS_DATABASE);
    }
  }

  async disconnect() {
    await mongoose.disconnect();
  }
}
