/* eslint-disable import/no-extraneous-dependencies */
import { faker } from '@faker-js/faker';
import { CreateBatchSchema } from '../../src/types/Batch';

export class BatchData {
  static create(d?: Partial<CreateBatchSchema>): CreateBatchSchema {
    return {
      product_id: faker.database.mongodbObjectId(),
      quantity: faker.number.int({ min: 1 }),
      ...d
    };
  }
}
