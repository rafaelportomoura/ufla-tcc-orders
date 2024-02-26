import { FastifyReply, FastifyRequest } from 'fastify';
import { Validator } from '../adapters/validate';
import { aws_params } from '../aws/config';
import { ListOrders } from '../business/List';
import { HTTP_STATUS_CODE } from '../constants/httpStatus';
import { list_orders_schema } from '../schemas/list';
import { ListOrdersResponse } from '../types/ListOrder';

export async function list(req: FastifyRequest, res: FastifyReply): Promise<ListOrdersResponse> {
  const logger = req.log;
  const business = new ListOrders({
    logger,
    aws_params: aws_params()
  });
  const query = await Validator.validate(req.query, list_orders_schema);

  const response = await business.list(query);

  res.status(HTTP_STATUS_CODE.CREATED);
  return response;
}
