import z from 'zod';

export const sell_schema = z.object({
  stock_ids: z.number().int().positive().array(),
  order: z.object({
    _id: z.string(),
    products: z.record(
      z.object({
        quantity: z.number().int().positive(),
        price_unit: z.number().int().positive(),
        price_total: z.number().int().positive(),
        stocks_ids: z.number().int().positive().array()
      })
    ),
    created_at: z.string(),
    updated_at: z.string(),
    status: z.string(),
    price_total: z.number().int().positive(),
    username: z.string()
  })
});
