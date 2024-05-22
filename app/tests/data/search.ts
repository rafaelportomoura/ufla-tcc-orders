/* eslint-disable import/no-extraneous-dependencies */
import { faker } from '@faker-js/faker';
import { OPERATOR, SORT_KEY } from '../../src/constants/search';
import { ListOrdersQuery } from '../../src/types/ListOrder';
import { Operator } from '../../src/types/Search';
import { OrderData } from './order';
import { ProductData } from './product';

type Search = ListOrdersQuery['search'];
type DeepPartial<T extends Record<string, unknown> | Search> = {
  [K in keyof T]?: T[K] extends Record<string, unknown> ? DeepPartial<T[K]> : unknown;
};
export class SearchData {
  static filter(d?: Partial<ListOrdersQuery>): ListOrdersQuery {
    return {
      search: this.search(),
      project: this.project(),
      page: 1,
      size: 10,
      sort: SORT_KEY.ASC,
      sort_by: this.sortBy(),
      ...d
    };
  }

  static search(
    d?: DeepPartial<Search>,
    selected: string[] = ['username', 'status', 'products', 'price_total']
  ): Search {
    const s: DeepPartial<Search> = {
      status: this.operators(OrderData.status(), {}, ['ne']),
      products: this.operators(ProductData._id(), {}, ['has']),
      price_total: this.operators(faker.number.float({ multipleOf: 0.01 }), {}, ['gte']),
      username: this.operators(faker.internet.userName(), {}, ['eq']),
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
      has: [v],
      not_has: [v],
      ...d
    })
      .filter(([k]) => select.includes(k as Operator))
      .reduce((p, [k, va]) => ({ ...p, [k]: va }), {}) as Record<Operator, unknown>;
  }

  static project(d?: Partial<ListOrdersQuery['project']>): ListOrdersQuery['project'] {
    return {
      _id: 1,
      price_total: 1,
      products: 1,
      username: 1,
      status: 1,
      created_at: 1,
      updated_at: 1,
      ...d
    };
  }

  static sortBy(): 'created_at' | 'updated_at' | 'status' | 'username' {
    const a = ['created_at', 'updated_at', 'status', 'username'] as const;
    return a[faker.number.int({ min: 0, max: a.length - 1 })];
  }
}
