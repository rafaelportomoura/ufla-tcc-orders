import { FastifyBaseLogger } from 'fastify';
import { z } from 'zod';
import { get_order_schema } from '../schemas/get_order';
import { AwsParams } from './Aws';

export type GetOrderArgs = {
  aws_params: AwsParams;
  logger: FastifyBaseLogger;
};

export type GetOrder = z.infer<typeof get_order_schema>;
