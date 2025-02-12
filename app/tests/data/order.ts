/* eslint-disable import/no-extraneous-dependencies */
import { faker } from '@faker-js/faker';
import { STATUS, STATUS_MAP } from '../../src/constants/status';
import { CreateOrder, OrderInResponse } from '../../src/types/CreateOrder';
import { GetOrder } from '../../src/types/GetOrder';
import { ListOrdersResponse } from '../../src/types/ListOrder';
import { Order, OrderProduct, RawOrder } from '../../src/types/Order';
import { GetProductsPrice } from '../../src/types/Products';
import { ProductData } from './product';

export class OrderData {
  static readonly _id = () => faker.database.mongodbObjectId();

  static readonly status = () => STATUS[faker.number.int({ min: 0, max: STATUS.length - 1 })];

  static create(d?: Partial<CreateOrder>): CreateOrder {
    return {
      username: faker.internet.userName(),
      products: {
        [ProductData._id()]: faker.number.int({ min: 1 })
      },
      ...d
    };
  }

  static createToOrder({ products, username }: CreateOrder, product_prices: GetProductsPrice): Order {
    return this.order({
      username,
      price_total: product_prices.reduce((a, { _id, price }) => a + products[_id] * price, 0),
      products: Object.keys(products).reduce(
        (a, _id) => ({
          ...a,
          [_id]: this.toOrderProduct(products[_id], product_prices.find((v) => v._id === _id)?.price as number)
        }),
        {} as unknown as Record<string, OrderProduct>
      ),
      status: STATUS_MAP.PENDING
    });
  }

  static toOrderProduct(quantity: number, price_unit: number): OrderProduct {
    return this.product({ quantity, price_unit, price_total: quantity * price_unit });
  }

  static raw(d?: Partial<RawOrder>): RawOrder {
    return {
      products: {
        [ProductData._id()]: this.product()
      },
      price_total: faker.number.float({ multipleOf: 0.01 }),
      username: faker.internet.userName(),
      ...d
    };
  }

  static product(d?: Partial<OrderProduct>): OrderProduct {
    return {
      quantity: faker.number.int({ min: 1 }),
      price_unit: faker.number.float({ multipleOf: 0.01 }),
      price_total: faker.number.float({ multipleOf: 0.01 }),
      stocks_ids: [faker.number.int({ min: 1 })],
      ...d
    };
  }

  static order(d?: Partial<Order>): Order {
    return {
      ...this.raw(),
      _id: this._id(),
      created_at: faker.date.recent(),
      updated_at: faker.date.recent(),
      status: this.status(),
      ...d
    };
  }

  static orderInResponse(order: Order): OrderInResponse {
    return {
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
    };
  }

  static get(d?: Partial<GetOrder>): GetOrder {
    return {
      username: faker.internet.userName(),
      order_id: this._id(),
      ...d
    };
  }

  static listResponse(d?: Partial<ListOrdersResponse>): ListOrdersResponse {
    return {
      page: 1,
      pages: 1,
      count: 1,
      orders: [this.order()],
      ...d
    };
  }
}
