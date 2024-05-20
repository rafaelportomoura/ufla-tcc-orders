import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { Logger } from '../adapters/logger';
import { Validator } from '../adapters/validate';
import { aws_params } from '../aws/config';
import { CreateOrderBusiness } from '../business/Create';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { CONFIGURATION } from '../constants/configuration';
import { URLS } from '../constants/urls';
import { BaseError } from '../exceptions/BaseError';
import { error_handler } from '../middlewares/error';
import { create_order_body_schema } from '../schemas/create';
import { user_id_schema } from '../schemas/user_id';
import { CreateOrderResponse, OrderInResponse } from '../types/CreateOrder';
import { Order } from '../types/Order';
import { request_id } from '../utils/requestId';

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

export async function create(req: FastifyRequest, res: FastifyReply): Promise<CreateOrderResponse | BaseError> {
  const req_id = request_id(req);
  const logger = new Logger(CONFIGURATION.LOG_LEVEL, req_id);
  try {
    const urls = URLS(CONFIGURATION);
    const business = new CreateOrderBusiness({
      logger,
      event_bus_topic: CONFIGURATION.EVENT_BUS,
      aws_params: aws_params(),
      stock_base_url: urls.STOCKS,
      products_base_url: urls.PRODUCTS,
      request_id: req_id
    });
    const { user_id } = await Validator.validate(req.headers, user_id_schema);
    const body = await Validator.validate(req.body, create_order_body_schema);
    const order = await business.create({ ...body, user_id });

    const response = {
      order: map_order(order),
      ...CODE_MESSAGES.CREATE_ORDER
    };
    res.status(StatusCodes.CREATED);
    return response;
  } catch (error) {
    const response = error_handler(logger, error, 'create');
    res.status(response.status);
    return response;
  }
}
