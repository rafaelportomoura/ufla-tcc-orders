import { DeleteObjectCommand, S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { FastifyBaseLogger } from 'fastify';

export class S3 {
  private client: S3Client;

  constructor(
    config: S3ClientConfig,
    private logger: FastifyBaseLogger
  ) {
    this.client = new S3Client(config);
  }

  async upload(bucket: string, key: string, body: Buffer): Promise<void> {
    const command = new Upload({
      client: this.client,
      params: {
        Bucket: bucket,
        Key: key,
        Body: body
      }
    });

    command.on('httpUploadProgress', (progress) => this.logger.debug(progress));

    await command.done();
  }

  async remove(bucket: string, key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key
    });
    const response = await this.client.send(command);
    this.logger.debug(response);
  }
}
