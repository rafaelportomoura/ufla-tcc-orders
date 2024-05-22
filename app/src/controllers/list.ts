import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { Logger } from '../adapters/logger';
import { Validator } from '../adapters/validate';
import { aws_params } from '../aws/config';
import { ListOrders } from '../business/List';
import { CONFIGURATION } from '../constants/configuration';
import { BaseError } from '../exceptions/BaseError';
import { error_handler } from '../middlewares/error';
import { list_orders_schema } from '../schemas/list';
import { ListOrdersResponse } from '../types/ListOrder';
import { request_id } from '../utils/requestId';

export async function list(
  req: FastifyRequest,
  res: FastifyReply
): Promise<ListOrdersResponse | ReturnType<BaseError['toJSON']>> {
  const logger = new Logger(CONFIGURATION.LOG_LEVEL, request_id(req));
  try {
    const business = new ListOrders({
      logger,
      aws_params: aws_params()
    });
    const query = await Validator.validate(req.query, list_orders_schema);

    const response = await business.list(query);

    res.status(StatusCodes.OK);
    return response;
  } catch (error) {
    const response = error_handler(logger, error, 'list');
    res.status(response.status);
    return response.toJSON();
  }
}
