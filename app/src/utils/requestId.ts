import { randomUUID } from 'crypto';
import { FastifyRequest } from 'fastify';

export const request_id = (req: FastifyRequest): string => (req.headers.requestId as string) ?? randomUUID();
