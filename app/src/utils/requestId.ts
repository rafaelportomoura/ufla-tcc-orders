import { createId } from '@paralleldrive/cuid2';
import { FastifyRequest } from 'fastify';

export const request_id = ({ headers }: Pick<FastifyRequest, 'headers'> = { headers: {} }): string =>
  (headers.request_id as string) ?? createId();
