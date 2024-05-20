import { z } from 'zod';

const number_of_keys = <K extends string | number | symbol, T>(obj: Record<K, T>) => Object.keys(obj).length > 0;

export const create_order_body_schema = z.object({
  products: z.record(z.number()).refine(number_of_keys, 'The order must have at least one product')
});
