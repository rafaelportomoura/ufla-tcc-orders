import { CODE_MESSAGES } from '../constants/codeMessages';
import { EVENT_STATUS, EVENT_TYPE } from '../constants/event';
import { STATUS_MAP } from '../constants/status';
import { BadRequestError } from '../exceptions/BadRequestError';
import { NotFoundError } from '../exceptions/NotFoundError';
import { OrderRepository } from '../repositories/order';
import { EventBus } from '../services/EventBus';
import { Approve, ApproveArgs } from '../types/Approve';
import { Order } from '../types/Order';

export class ApproveBusiness {
  private order_repository: OrderRepository;

  private event_bus: EventBus;

  constructor({ aws_params, logger, event_bus_topic }: ApproveArgs) {
    this.order_repository = new OrderRepository(aws_params, logger);
    this.event_bus = new EventBus(logger, event_bus_topic, aws_params);
  }

  async approve({ order_id }: Approve): Promise<void> {
    const old_order = await this.order_repository.findOne({ _id: order_id });

    if (!old_order) {
      throw new NotFoundError(CODE_MESSAGES.NOT_FOUND_ERROR);
    }

    if (old_order.status !== STATUS_MAP.PENDING) {
      throw new BadRequestError(CODE_MESSAGES.CANT_CHANGE_STATUS);
    }

    const order = (await this.order_repository.changeStatus(order_id, STATUS_MAP.APPROVED)) as Order;

    const message_attributes = this.event_bus.messageAttributes(EVENT_TYPE.APPROVED, EVENT_STATUS.SUCCESS);
    await this.event_bus.pub(
      {
        order,
        stock_ids: Object.keys(order.products)
          .map((v) => order.products[v].stocks_ids)
          .flat()
      },
      message_attributes
    );
  }
}
