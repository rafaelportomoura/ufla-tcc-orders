import { FastifyReply, FastifyRequest } from 'fastify';
import { Validator } from '../adapters/validate';
import { aws_params } from '../aws/config';
import { CreateOrderBusiness } from '../business/Create';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { CONFIGURATION } from '../constants/configuration';
import { HTTP_STATUS_CODE } from '../constants/httpStatus';
import { create_order_body_schema } from '../schemas/create';
import { user_id_schema } from '../schemas/user_id';
import { CreateOrderResponse, OrderInResponse } from '../types/CreateOrder';
import { Order } from '../types/Order';

const map_order = (order: Order): OrderInResponse => ({
  order_id: order._id,
  price_total: order.price_total,
  price_per_product: Object.entries(order.products).reduce(
    (acc, [product_id, { price_unit, quantity, price_total }]) => ({
      ...acc,
      [product_id]: {
        price_unit,
        quantity,
        price_total
      }
    }),
    {}
  )
});

export async function create(req: FastifyRequest, res: FastifyReply): Promise<CreateOrderResponse> {
  const logger = req.log;
  const business = new CreateOrderBusiness({
    logger,
    event_bus_topic: CONFIGURATION.EVENT_BUS,
    aws_params: aws_params(),
    stock_base_url: CONFIGURATION.STOCK_URL,
    products_base_url: CONFIGURATION.PRODUCT_URL
  });
  const { user_id } = await Validator.validate(req.headers, user_id_schema);
  const body = await Validator.validate(req.body, create_order_body_schema);
  const order = await business.create({ ...body, user_id });

  const response = {
    order: map_order(order),
    ...CODE_MESSAGES.CREATE_ORDER
  };
  res.status(HTTP_STATUS_CODE.CREATED);
  return response;
}
