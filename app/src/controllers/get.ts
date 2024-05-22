import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { Logger } from '../adapters/logger';
import { Validator } from '../adapters/validate';
import { aws_params } from '../aws/config';
import { GetOrderBusiness } from '../business/GetOrder';
import { CONFIGURATION } from '../constants/configuration';
import { BaseError } from '../exceptions/BaseError';
import { error_handler } from '../middlewares/error';
import { get_order_schema } from '../schemas/get_order';
import { Order } from '../types/Order';
import { request_id } from '../utils/requestId';

export async function get(req: FastifyRequest, res: FastifyReply): Promise<Order | ReturnType<BaseError['toJSON']>> {
  const logger = new Logger(CONFIGURATION.LOG_LEVEL, request_id(req));
  try {
    const business = new GetOrderBusiness({
      logger,
      aws_params: aws_params()
    });

    const params = await Validator.validate(req.params, get_order_schema);

    const response = await business.get(params);

    res.status(StatusCodes.OK);
    return response;
  } catch (error) {
    const response = error_handler(logger, error, 'get');
    res.status(response.status);
    return response.toJSON();
  }
}
