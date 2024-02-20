import {
  DeleteMessageCommand,
  DeleteMessageCommandInput,
  DeleteMessageCommandOutput,
  GetQueueAttributesCommand,
  GetQueueAttributesCommandInput,
  GetQueueAttributesCommandOutput,
  QueueAttributeName,
  ReceiveMessageCommand,
  ReceiveMessageCommandInput,
  ReceiveMessageCommandOutput,
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

  async receiveMessage(params: Partial<ReceiveMessageCommandInput>): Promise<ReceiveMessageCommandOutput> {
    const input = {
      ...params,
      QueueUrl: this.queue_url
    };
    const command = new ReceiveMessageCommand(input);

    const response = await this.client.send(command);

    return response;
  }

  async deleteMessage(receipt_handle: DeleteMessageCommandInput['ReceiptHandle']): Promise<DeleteMessageCommandOutput> {
    const input: DeleteMessageCommandInput = {
      QueueUrl: this.queue_url,
      ReceiptHandle: receipt_handle
    };

    const command = new DeleteMessageCommand(input);

    const response = await this.client.send(command);

    return response;
  }

  async getAttributes(attribute_names: QueueAttributeName[]): Promise<GetQueueAttributesCommandOutput> {
    const input: GetQueueAttributesCommandInput = {
      QueueUrl: this.queue_url,
      AttributeNames: attribute_names
    };

    const command = new GetQueueAttributesCommand(input);

    const response = await this.client.send(command);

    return response;
  }

  destroy(): void {
    this.client.destroy();
  }
}
