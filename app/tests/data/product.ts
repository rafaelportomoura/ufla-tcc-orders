/* eslint-disable import/no-extraneous-dependencies */
import { faker } from '@faker-js/faker';
import { Product } from '../../src/types/Products';

export class ProductData {
  static readonly _id = () => faker.database.mongodbObjectId();

  static product(d?: Partial<Product>): Product {
    return {
      _id: this._id(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.number.float({ multipleOf: 0.01 }),
      images: [faker.internet.url()],
      created_at: faker.date.recent(),
      updated_at: faker.date.recent(),
      ...d
    };
  }
}
