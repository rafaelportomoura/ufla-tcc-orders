/* eslint-disable import/no-extraneous-dependencies */
import { faker } from '@faker-js/faker';
import { User } from '../../src/types/User';

export class UserData {
  static readonly username = () => faker.internet.userName();

  static user(d?: Partial<User>): User {
    return {
      username: this.username(),
      enabled: faker.datatype.boolean(),
      updated_at: faker.date.recent().toISOString(),
      created_at: faker.date.recent().toISOString(),
      status: ['CONFIRMED', 'UNCONFIRMED'][faker.number.int({ min: 0, max: 1 })],
      email: faker.internet.email(),
      'custom:group': ['admin', 'customer'][faker.number.int({ min: 0, max: 1 })],
      sub: faker.string.uuid(),
      ...d
    };
  }
}
