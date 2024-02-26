import { isValidObjectId } from 'mongoose';
import { z } from 'zod';

export const reject_schema = z.object({
  order_id: z.string().refine(isValidObjectId, 'Invalid order_id')
});
