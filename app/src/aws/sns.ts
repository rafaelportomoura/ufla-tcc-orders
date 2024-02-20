/* eslint-disable no-empty-function */
import {
  PublishCommand,
  PublishCommandInput,
  PublishCommandOutput,
  SNSClient,
  SNSClientConfig
} from '@aws-sdk/client-sns';

export class SNS {
  private client: SNSClient;

  constructor(config: SNSClientConfig) {
    this.client = new SNSClient(config);
  }

  async pub(input: PublishCommandInput): Promise<PublishCommandOutput> {
    const command = new PublishCommand(input);

    return this.client.send(command);
  }
}
