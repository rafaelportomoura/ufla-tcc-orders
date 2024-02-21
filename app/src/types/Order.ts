import { ObjectId } from 'mongoose';
import { STATUS } from '../constants/status';

export type OrderStatus = (typeof STATUS)[number];

export type OrderProduct = {
  quantity: number;
  price_unit: number;
  price_total: number;
  stocks_ids: Array<number>;
};

export type Order = {
  _id: ObjectId;
  products: Record<string, OrderProduct>;
  created_at: Date;
  updated_at: Date;
  status: OrderStatus;
  price_total: number;
  user_id: string;
};

export type RawOrder = Omit<Order, '_id' | 'created_at' | 'updated_at' | 'status'>;
