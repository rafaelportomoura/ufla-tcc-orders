/* eslint-disable import/no-extraneous-dependencies */
import { faker } from '@faker-js/faker';
import { OPERATOR, SORT_BY, SORT_KEY } from '../../src/constants/search';
import { ListProductsFilter } from '../../src/types/ListProducts';
import { Operator } from '../../src/types/Search';

type Search = ListProductsFilter['search'];
type DeepPartial<T extends Record<string, unknown> | Search> = {
  [K in keyof T]?: T[K] extends Record<string, unknown> ? DeepPartial<T[K]> : unknown;
};
export class ListProductData {
  static filter(d?: Partial<ListProductsFilter>): ListProductsFilter {
    return {
      search: this.search(),
      page: 1,
      size: 10,
      sort: SORT_KEY.ASC,
      sort_by: SORT_BY[0],
      ...d
    };
  }

  static search(
    d?: DeepPartial<Search>,
    selected: string[] = ['_id', 'name', 'description', 'price', 'created_at', 'updated_at']
  ): Search {
    const s: DeepPartial<Search> = {
      _id: this.operators(faker.database.mongodbObjectId(), {}, [OPERATOR.EQ, OPERATOR.LTE]),
      name: this.operators(faker.commerce.productName(), {}, [OPERATOR.NE, OPERATOR.GT]),
      description: this.operators(faker.commerce.productDescription(), {}, [OPERATOR.IN, OPERATOR.GTE]),
      price: this.operators(faker.number.float({ multipleOf: 0.01 }), {}, [OPERATOR.NIN]),
      created_at: this.operators(faker.date.recent().toISOString(), {}, [OPERATOR.REGEX]),
      updated_at: this.operators(faker.date.recent().toISOString(), {}, [OPERATOR.LT]),
      ...d
    };
    const response = Object.entries(s).reduce(
      (a, [k, v]) => (selected.includes(k) ? { ...a, [k]: v } : a),
      {}
    ) as Search;
    return response;
  }

  static operators(v: unknown, d: Partial<Record<Operator, unknown>> = {}, select: Operator[] = [OPERATOR.EQ]) {
    return Object.entries({
      eq: v,
      ne: v,
      in: [v],
      nin: [v],
      regex: v,
      lt: v,
      lte: v,
      gt: v,
      gte: v,
      ...d
    })
      .filter(([k]) => select.includes(k as Operator))
      .reduce((p, [k, va]) => ({ ...p, [k]: va }), {}) as Record<Operator, unknown>;
  }
}
