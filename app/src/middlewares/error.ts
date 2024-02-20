import { FastifyReply, FastifyRequest } from 'fastify';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { HTTP_STATUS_CODE } from '../constants/httpStatus';
import { BaseError } from '../exceptions/BaseError';
import { InternalServerError } from '../exceptions/InternalServerError';

export const error_middleware = (error: Error, req: FastifyRequest, reply: FastifyReply) => {
  req.log.error(error, error.message);
  let response = new InternalServerError(CODE_MESSAGES.INTERNAL_SERVER_ERROR).toJSON();
  let code: number = HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;
  if (error instanceof BaseError) {
    response = error.toJSON();
    code = error.status;
  }

  reply.status(code).send(response);
};
