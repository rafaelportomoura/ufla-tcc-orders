/* eslint-disable import/no-extraneous-dependencies */
import { faker } from '@faker-js/faker';
import { Reserve } from '../../src/types/StockService';
import { ProductData } from './product';

export class StockData {
  static reserve(d?: Partial<Reserve>): Reserve {
    return {
      stock_ids: [faker.number.int({ min: 1 })],
      quantity: faker.number.int({ min: 1 }),
      product_id: ProductData._id(),
      ...d
    };
  }
}
