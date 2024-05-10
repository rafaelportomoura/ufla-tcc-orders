import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { Logger } from '../adapters/logger';
import { Validator } from '../adapters/validate';
import { aws_params } from '../aws/config';
import { ListOrders } from '../business/List';
import { CONFIGURATION } from '../constants/configuration';
import { OPERATOR } from '../constants/search';
import { BaseError } from '../exceptions/BaseError';
import { error_handler } from '../middlewares/error';
import { list_user_orders_schema } from '../schemas/list_user_orders';
import { user_id_schema } from '../schemas/user_id';
import { ListOrdersResponse } from '../types/ListOrder';
import { SearchSchema } from '../types/Search';
import { request_id } from '../utils/requestId';

export async function listByUser(req: FastifyRequest, res: FastifyReply): Promise<ListOrdersResponse | BaseError> {
  const logger = new Logger(CONFIGURATION.LOG_LEVEL, request_id(req));
  try {
    const business = new ListOrders({
      logger,
      aws_params: aws_params()
    });
    const query = await Validator.validate(req.query, list_user_orders_schema);
    const { user_id } = await Validator.validate(req.params, user_id_schema);

    (query.search as SearchSchema).user_id = { [OPERATOR.EQ]: user_id };

    const response = await business.list(query);

    res.status(StatusCodes.OK);
    return response;
  } catch (error) {
    const response = error_handler(logger, error, 'listByUser');
    res.status(response.status);
    return response;
  }
}
