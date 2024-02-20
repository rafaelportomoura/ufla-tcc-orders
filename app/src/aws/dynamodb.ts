import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import {
  DeleteCommand,
  DeleteCommandInput,
  DeleteCommandOutput,
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandInput,
  GetCommandOutput,
  PutCommand,
  PutCommandInput,
  PutCommandOutput,
  QueryCommand,
  QueryCommandInput,
  QueryCommandOutput,
  ScanCommand,
  ScanCommandInput,
  ScanCommandOutput
} from '@aws-sdk/lib-dynamodb';

export class DynamoDB {
  private client: DynamoDBDocumentClient;

  constructor(
    protected table: string,
    config: DynamoDBClientConfig
  ) {
    this.client = DynamoDBDocumentClient.from(new DynamoDBClient(config));
  }

  put(input: Omit<PutCommandInput, 'TableName'>): Promise<PutCommandOutput> {
    const command = new PutCommand({ TableName: this.table, ...input });

    return this.client.send(command);
  }

  get(input: Omit<GetCommandInput, 'TableName'>): Promise<GetCommandOutput> {
    const command = new GetCommand({ TableName: this.table, ...input });

    return this.client.send(command);
  }

  scan(input: Omit<ScanCommandInput, 'TableName'>): Promise<ScanCommandOutput> {
    const command = new ScanCommand({ TableName: this.table, ...input });

    return this.client.send(command);
  }

  query(input: Omit<QueryCommandInput, 'TableName'>): Promise<QueryCommandOutput> {
    const command = new QueryCommand({ TableName: this.table, ...input });

    return this.client.send(command);
  }

  delete(input: Omit<DeleteCommandInput, 'TableName'>): Promise<DeleteCommandOutput> {
    const command = new DeleteCommand({ TableName: this.table, ...input });

    return this.client.send(command);
  }
}
