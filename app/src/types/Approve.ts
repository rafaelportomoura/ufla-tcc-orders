import { FastifyBaseLogger } from 'fastify';
import { z } from 'zod';
import { approve_schema } from '../schemas/approve';
import { AwsParams } from './Aws';

export type Approve = z.infer<typeof approve_schema>;

export type ApproveArgs = {
  aws_params: AwsParams;
  logger: FastifyBaseLogger;
  event_bus_topic: string;
};
