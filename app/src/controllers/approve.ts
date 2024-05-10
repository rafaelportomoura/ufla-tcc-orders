import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { Logger } from '../adapters/logger';
import { Validator } from '../adapters/validate';
import { aws_params } from '../aws/config';
import { ApproveBusiness } from '../business/Approve';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { CONFIGURATION } from '../constants/configuration';
import { BaseError } from '../exceptions/BaseError';
import { error_handler } from '../middlewares/error';
import { order_id_schema } from '../schemas/order_id';
import { CodeMessage } from '../types/CodeMessage';
import { request_id } from '../utils/requestId';

export async function approve(req: FastifyRequest, res: FastifyReply): Promise<CodeMessage | BaseError> {
  const logger = new Logger(CONFIGURATION.LOG_LEVEL, request_id(req));
  try {
    const business = new ApproveBusiness({
      logger,
      event_bus_topic: CONFIGURATION.EVENT_BUS,
      aws_params: aws_params()
    });
    const body = await Validator.validate(req.body, order_id_schema);

    await business.approve(body);

    res.status(StatusCodes.OK);
    return CODE_MESSAGES.APPROVED;
  } catch (error) {
    const response = error_handler(logger, error, 'approve');
    res.status(response.status);
    return response;
  }
}
