import { FastifyInstance, FastifyPluginOptions, FastifyRegisterOptions } from 'fastify';
import { route } from './route';

export function router(server: FastifyInstance, _: FastifyRegisterOptions<FastifyPluginOptions>, done: () => void) {
  server.register(route, { prefix: '/route' });
  done();
}
