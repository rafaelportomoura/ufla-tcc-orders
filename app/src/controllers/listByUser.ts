import { FastifyReply, FastifyRequest } from 'fastify';
import { Validator } from '../adapters/validate';
import { aws_params } from '../aws/config';
import { ListOrders } from '../business/List';
import { HTTP_STATUS_CODE } from '../constants/httpStatus';
import { OPERATOR } from '../constants/search';
import { list_user_orders_schema } from '../schemas/list_user_orders';
import { user_id_schema } from '../schemas/user_id';
import { ListOrdersResponse } from '../types/ListOrder';
import { SearchSchema } from '../types/Search';

export async function listByUser(req: FastifyRequest, res: FastifyReply): Promise<ListOrdersResponse> {
  const logger = req.log;
  const business = new ListOrders({
    logger,
    aws_params: aws_params()
  });
  const query = await Validator.validate(req.query, list_user_orders_schema);
  const { user_id } = await Validator.validate(req.params, user_id_schema);

  (query.search as SearchSchema).user_id = { [OPERATOR.EQ]: user_id };

  const response = await business.list(query);

  res.status(HTTP_STATUS_CODE.OK);
  return response;
}
