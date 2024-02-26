import { FastifyBaseLogger } from 'fastify';
import { z } from 'zod';
import { reject_schema } from '../schemas/reject';
import { AwsParams } from './Aws';

export type RejectArgs = {
  aws_params: AwsParams;
  logger: FastifyBaseLogger;
  event_bus_topic: string;
};

export type Reject = z.infer<typeof reject_schema>;
