import {
  SQSClient,
  SQSClientConfig,
  SendMessageCommand,
  SendMessageCommandOutput,
  SendMessageRequest
} from '@aws-sdk/client-sqs';

export class SQS {
  private client: SQSClient;

  constructor(
    private queue_url: string,
    config: SQSClientConfig
  ) {
    this.client = new SQSClient(config);
  }

  async send(message: unknown): Promise<SendMessageCommandOutput> {
    const input: SendMessageRequest = {
      MessageBody: JSON.stringify(message),
      QueueUrl: this.queue_url
    };

    const command = new SendMessageCommand(input);

    const response = await this.client.send(command);

    return response;
  }
}
