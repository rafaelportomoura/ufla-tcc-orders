import { FastifyInstance, FastifyPluginOptions, FastifyRegisterOptions } from 'fastify';
import { approve } from '../controllers/approve';
import { create } from '../controllers/create';
import { list } from '../controllers/list';
import { reject } from '../controllers/reject';

export function router(server: FastifyInstance, _: FastifyRegisterOptions<FastifyPluginOptions>, done: () => void) {
  server.post('/', create);
  server.post('/reject', reject);
  server.post('/approve', approve);
  server.get('/', list);
  done();
}
