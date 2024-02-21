import { OrderRepository } from '../repositories/order';
import { ProductsService } from '../services/Products';
import { StockService } from '../services/Stock';
import { CreateOrder, CreateOrderArgs } from '../types/CreateOrder';
import { Order, OrderProduct } from '../types/Order';

export class CreateOrderBusiness {
  private order_repository: OrderRepository;

  private stock_service: StockService;

  private product_service: ProductsService;

  constructor({ aws_params, logger, stock_base_url, products_base_url }: CreateOrderArgs) {
    this.order_repository = new OrderRepository(aws_params, logger);
    this.stock_service = new StockService({ base_url: stock_base_url, logger });
    this.product_service = new ProductsService({ base_url: products_base_url, logger });
  }

  async createOrder(order: CreateOrder): Promise<Order> {
    const product_prices = await this.product_service.getProductsPrice(Object.keys(order.products));
    const reserved = await this.stock_service.reserve(order.products);

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

    return this.order_repository.create({ user_id: order.user_id, products, price_total });
  }
}
