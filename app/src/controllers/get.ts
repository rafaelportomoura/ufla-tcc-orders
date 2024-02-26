import { FastifyReply, FastifyRequest } from 'fastify';
import { Validator } from '../adapters/validate';
import { aws_params } from '../aws/config';
import { GetOrderBusiness } from '../business/GetOrder';
import { HTTP_STATUS_CODE } from '../constants/httpStatus';
import { get_order_schema } from '../schemas/get_order';
import { Order } from '../types/Order';

export async function get(req: FastifyRequest, res: FastifyReply): Promise<Order> {
  const logger = req.log;
  const business = new GetOrderBusiness({
    logger,
    aws_params: aws_params()
  });

  const params = await Validator.validate(req.params, get_order_schema);

  const response = await business.get(params);

  res.status(HTTP_STATUS_CODE.OK);
  return response;
}
