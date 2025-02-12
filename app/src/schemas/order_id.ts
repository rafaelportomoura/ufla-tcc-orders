import { isValidObjectId } from 'mongoose';
import { z } from 'zod';

export const order_id_schema = z.object({
  order_id: z.string().refine(isValidObjectId, 'Invalid order_id')
});
