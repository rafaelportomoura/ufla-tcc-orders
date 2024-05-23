import z from 'zod';

export const sell_schema = z.object({
  stock_ids: z.number().int().positive().array(),
  order: z.object({
    _id: z.string(),
    products: z.record(
      z.object({
        quantity: z.number(),
        price_unit: z.number(),
        price_total: z.number(),
        stocks_ids: z.number().array()
      })
    ),
    created_at: z.string(),
    updated_at: z.string(),
    status: z.string(),
    price_total: z.number().int().positive(),
    username: z.string()
  })
});
