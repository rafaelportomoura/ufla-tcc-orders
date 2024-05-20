/* eslint-disable import/no-extraneous-dependencies */
import { faker } from '@faker-js/faker';
import { DocumentParams, DocumentSecret } from '../../src/types/DocumentSecret';

export class DocumentDatabaseData {
  static secret(d?: Partial<DocumentSecret>): DocumentSecret {
    return {
      username: faker.internet.userName(),
      password: faker.internet.password(),
      ...d
    };
  }

  static params(d?: Partial<DocumentParams>): DocumentParams {
    return {
      protocol: faker.internet.protocol(),
      host: faker.internet.url(),
      options: {
        [faker.lorem.word()]: faker.lorem.word()
      },
      ...d
    };
  }
}
