import { FastifyBaseLogger } from 'fastify';
import { EVENT_NOTIFICATION, EVENT_STATUS, EVENT_TYPE } from '../constants/event';
import { OrderRepository } from '../repositories/order';
import { EventBus } from '../services/EventBus';
import { ProductsService } from '../services/Products';
import { StockService } from '../services/Stock';
import { CreateOrder, CreateOrderArgs } from '../types/CreateOrder';
import { Order, OrderProduct } from '../types/Order';

export class CreateOrderBusiness {
  private order_repository: OrderRepository;

  private stock_service: StockService;

  private product_service: ProductsService;

  private event_bus: EventBus;

  private logger: FastifyBaseLogger;

  constructor({ aws_params, logger, stock_base_url, products_base_url, event_bus_topic }: CreateOrderArgs) {
    this.order_repository = new OrderRepository(aws_params, logger);
    this.stock_service = new StockService({ base_url: stock_base_url, logger });
    this.product_service = new ProductsService({ base_url: products_base_url, logger });
    this.event_bus = new EventBus(logger, event_bus_topic, aws_params);
    this.logger = logger;
  }

  async create(raw_order: CreateOrder): Promise<Order> {
    const product_prices = await this.product_service.getProductsPrice(Object.keys(raw_order.products));
    const reserved = await this.stock_service.reserve(raw_order);
    const products = product_prices.reduce(
      (acc, { _id, price }) => ({ ...acc, [_id]: { price_unit: price } as OrderProduct }),
      {} as Record<string, OrderProduct>
    );
    let price_total = 0;
    reserved.forEach(({ product_id, quantity, stock_ids }) => {
      products[product_id].quantity = quantity;
      products[product_id].stocks_ids = stock_ids;
      products[product_id].price_total = quantity * products[product_id].price_unit;
      price_total += products[product_id].price_total;
    });

    this.logger.info({ products, price_total }, 'CreateOrderBusiness.create');

    const order = await this.order_repository.create({ user_id: raw_order.user_id, products, price_total });

    const message_attributes = this.event_bus.messageAttributes(
      EVENT_TYPE.CREATE,
      EVENT_STATUS.SUCCESS,
      EVENT_NOTIFICATION.EMAIL
    );
    await this.event_bus.pub(order, message_attributes);

    return order;
  }
}
