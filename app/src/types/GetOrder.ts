import { z } from 'zod';
import { Logger } from '../adapters/logger';
import { get_order_schema } from '../schemas/get_order';
import { AwsParams } from './Aws';

export type GetOrderArgs = {
  aws_params: AwsParams;
  logger: Logger;
};

export type GetOrder = z.infer<typeof get_order_schema>;
