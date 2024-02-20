import FastifyCors from '@fastify/cors';
import Fastify from 'fastify';
import qs from 'fastify-qs';

import { logger_options } from '../adapters/logger';
import { CONFIGURATION } from '../constants/configuration';
import { HTTP_STATUS_CODE } from '../constants/httpStatus';
import { error_middleware } from '../middlewares/error';
import { router } from '../routes';

async function main() {
  const server = Fastify({
    logger: logger_options(CONFIGURATION.STAGE, CONFIGURATION.LOG_LEVEL)
  });
  server.register(qs, {});
  server.register(FastifyCors, {
    origin: '*',
    allowedHeaders: '*',
    methods: '*'
  });
  server.setErrorHandler(error_middleware);

  server.get('/health-check', (_, res) => res.status(HTTP_STATUS_CODE.OK).send('alive'));

  server.register(router, { prefix: '/v1' });

  server.listen(
    {
      port: CONFIGURATION.PORT,
      host: '0.0.0.0'
    },
    (err, addr) => {
      if (err) {
        server.log.error(err);
        process.exit(1);
      }

      server.log.info(`RUNNING ON PORT ${addr}`);
    }
  );
}

(async () => {
  await main();
})();
