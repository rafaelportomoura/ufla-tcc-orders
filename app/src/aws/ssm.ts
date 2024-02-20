/* eslint-disable no-empty-function */
import { GetParameterCommand, GetParameterRequest, SSMClient, SSMClientConfig } from '@aws-sdk/client-ssm';

export class SSM {
  private client: SSMClient;

  constructor(config: SSMClientConfig) {
    this.client = new SSMClient(config);
  }

  async getParams<T>(parameter_name: string, with_decryption = false): Promise<T> {
    const input: GetParameterRequest = { Name: parameter_name, WithDecryption: with_decryption };

    const command = new GetParameterCommand(input);

    const response = await this.client.send(command);

    const value = JSON.parse(response.Parameter?.Value as string);

    return value as T;
  }
}
