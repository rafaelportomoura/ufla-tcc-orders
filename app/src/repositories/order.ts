import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';
import { Logger } from '../adapters/logger';
import { aws_config } from '../aws/config';
import { DocumentDatabase } from '../database/document';
import { order_model } from '../entities/order';
import { AwsParams } from '../types/Aws';
import { Order, OrderStatus, RawOrder } from '../types/Order';

export class OrderRepository {
  private model: Model<Order>;

  private document_database: DocumentDatabase;

  constructor(aws: AwsParams, logger: Logger) {
    this.document_database = new DocumentDatabase(aws_config(aws), logger);
    this.model = order_model();
  }

  async connect() {
    await this.document_database.connect();
  }

  async disconnect() {
    await this.document_database.disconnect();
  }

  async create(payload: RawOrder): Promise<Order> {
    await this.connect();
    const order = await this.model.create(payload);

    return order.toObject();
  }

  async count(query: FilterQuery<Order>): Promise<number> {
    await this.connect();
    const response = await this.model.countDocuments(query);

    return response;
  }

  async changeStatus(_id: string, status: OrderStatus): Promise<Order | null> {
    await this.connect();
    const order = await this.model.findOneAndUpdate({ _id }, { status }, { new: true, lean: true });
    return order;
  }

  async find(
    query: FilterQuery<Order>,
    projection: ProjectionType<Order> = {},
    options: QueryOptions<Order> = {}
  ): Promise<Order[]> {
    await this.connect();
    const Orders = await this.model.find(query, projection, options);

    return options.lean ? (Orders as Order[]) : Orders.map((v) => v.toObject());
  }

  async findOne(
    query: FilterQuery<Order>,
    projection: ProjectionType<Order> = {},
    options: QueryOptions<Order> = {}
  ): Promise<Order | undefined> {
    await this.connect();
    const order = await this.model.findOne(query, projection, options);

    return options.lean ? (order as Order) : order?.toObject();
  }
}
