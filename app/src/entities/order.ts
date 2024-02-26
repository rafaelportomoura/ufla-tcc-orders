import { model, Schema } from 'mongoose';
import { COLLECTION_NAMES } from '../constants/collectionNames';
import { STATUS, STATUS_MAP } from '../constants/status';
import { Order } from '../types/Order';

const order_schema = new Schema<Order>(
  {
    products: Schema.Types.Mixed,
    status: { type: String, enum: STATUS, index: true, default: STATUS_MAP.PENDING },
    price_total: { type: Number, required: true },
    user_id: { type: String, required: true }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

export const order_model = () => model<Order>('Order', order_schema, COLLECTION_NAMES.ORDERS);
