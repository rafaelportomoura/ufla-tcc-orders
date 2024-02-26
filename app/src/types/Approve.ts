import { FastifyBaseLogger } from 'fastify';
import { z } from 'zod';
import { order_id_schema } from '../schemas/order_id';
import { AwsParams } from './Aws';

export type Approve = z.infer<typeof order_id_schema>;

export type ApproveArgs = {
  aws_params: AwsParams;
  logger: FastifyBaseLogger;
  event_bus_topic: string;
};
