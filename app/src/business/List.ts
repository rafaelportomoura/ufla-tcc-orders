import { isEmpty, omit } from 'lodash';
import { OrderRepository } from '../repositories/order';
import { ListOrdersArgs, ListOrdersQuery, ListOrdersResponse } from '../types/ListOrder';
import { Order } from '../types/Order';
import { SearchSchema } from '../types/Search';
import { Search } from '../utils/search';

export class ListOrders {
  private order_repository: OrderRepository;

  private search: Search<Order>;

  constructor({ aws_params, logger }: ListOrdersArgs) {
    this.order_repository = new OrderRepository(aws_params, logger);
    this.search = new Search<Order>();
  }

  async list(filter: ListOrdersQuery): Promise<ListOrdersResponse> {
    const { project } = filter;

    const search = omit(filter.search, ['products']) as SearchSchema;

    if (filter.search && filter.search.products && !isEmpty(filter.search.products)) {
      for (const [operator, ids] of Object.entries(filter.search.products)) {
        if (Array.isArray(ids)) {
          ids.forEach((id: string) => {
            search[`products.${id}`] = { [operator]: id };
          });
        }
      }
    }

    const query = this.search.createQuery(search);
    const options = this.search.createOptions(filter);

    const count = await this.order_repository.count(query);

    const list_info = this.search.listInfo({ ...options, ...filter, count });

    const orders = await this.order_repository.find(query, project, options);

    return {
      ...list_info,
      orders
    } as ListOrdersResponse;
  }
}
