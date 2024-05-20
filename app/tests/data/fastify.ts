/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import { FastifyReply, FastifyRequest } from 'fastify';
import { IncomingHttpHeaders } from 'node:http';
import sinon from 'sinon';

type FastifyRequestMock<T> = {
  body?: T;
  query?: unknown;
  params?: unknown;
  headers?: IncomingHttpHeaders;
} & Record<string, unknown>;

export const fastify_request = <T = unknown>(req?: FastifyRequestMock<T>): FastifyRequest =>
  ({
    body: {},
    query: {},
    params: {},
    headers: {},
    ...req
  }) as FastifyRequest;

export const fastify_reply = (res: Record<keyof FastifyReply, sinon.SinonStub>): FastifyReply =>
  res as unknown as FastifyReply;

export const fastify_stub = (
  res?: Partial<Record<keyof FastifyReply, sinon.SinonStub>>
): Record<keyof FastifyReply, sinon.SinonStub> =>
  ({
    status: sinon.stub().returnsThis(),
    send: sinon.stub(),
    ...res
  }) as Record<keyof FastifyReply, sinon.SinonStub>;
