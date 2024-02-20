/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
import {
  GetSecretValueCommand,
  GetSecretValueRequest,
  SecretsManagerClient,
  SecretsManagerClientConfig
} from '@aws-sdk/client-secrets-manager';

export class SecretsManager {
  private client: SecretsManagerClient;

  constructor(config: SecretsManagerClientConfig) {
    this.client = new SecretsManagerClient(config);
  }

  async getSecret<T = unknown>(secret_path: string): Promise<T> {
    const input: GetSecretValueRequest = {
      SecretId: secret_path
    };

    const command = new GetSecretValueCommand(input);

    const secrets = await this.client.send(command);

    return JSON.parse(secrets.SecretString as string) as T;
  }
}
