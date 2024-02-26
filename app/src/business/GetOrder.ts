import { CODE_MESSAGES } from '../constants/codeMessages';
import { NotFoundError } from '../exceptions/NotFoundError';
import { OrderRepository } from '../repositories/order';
import { GetOrder, GetOrderArgs } from '../types/GetOrder';
import { Order } from '../types/Order';

export class GetOrderBusiness {
  private order_repository: OrderRepository;

  constructor({ aws_params, logger }: GetOrderArgs) {
    this.order_repository = new OrderRepository(aws_params, logger);
  }

  async get({ order_id, user_id }: GetOrder): Promise<Order> {
    const order = await this.order_repository.findOne({ _id: order_id, user_id });

    if (!order) {
      throw new NotFoundError(CODE_MESSAGES.NOT_FOUND_ERROR);
    }

    return order;
  }
}
