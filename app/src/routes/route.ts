/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyInstance, FastifyPluginOptions, FastifyRegisterOptions } from 'fastify';
import { controller } from '../controllers/controller';

export function route(server: FastifyInstance, _: FastifyRegisterOptions<FastifyPluginOptions>, done: () => void) {
  server.post('/', controller);
  done();
}
