import { ZodTypeAny, z } from 'zod';

export const OPERATOR = {
  NE: 'ne',
  EQ: 'eq',
  IN: 'in',
  NIN: 'nin',
  REGEX: 'regex',
  LT: 'lt',
  LTE: 'lte',
  GT: 'gt',
  GTE: 'gte',
  HAS: 'has',
  NOT_HAS: 'not_has'
} as const;

export const OPERATORS = [...Object.values(OPERATOR)];

export const OBJECT_OPERATORS = [OPERATOR.HAS, OPERATOR.NOT_HAS] as const;

export const STRING_OPERATORS = [
  OPERATOR.NE,
  OPERATOR.EQ,
  OPERATOR.IN,
  OPERATOR.NIN,
  OPERATOR.REGEX,
  OPERATOR.LT,
  OPERATOR.LTE,
  OPERATOR.GT,
  OPERATOR.GTE
] as const;

export const NUMBER_OPERATORS = [
  OPERATOR.NE,
  OPERATOR.EQ,
  OPERATOR.IN,
  OPERATOR.NIN,
  OPERATOR.LT,
  OPERATOR.LTE,
  OPERATOR.GT,
  OPERATOR.GTE
] as const;

export const OPERATORS_MAP_TO_MONGO = {
  [OPERATOR.NE]: (v: unknown) => ({ $ne: v }),
  [OPERATOR.EQ]: (v: unknown) => ({ $eq: v }),
  [OPERATOR.IN]: (v: unknown) => ({ $in: v }),
  [OPERATOR.NIN]: (v: unknown) => ({ $nin: v }),
  [OPERATOR.REGEX]: (v: string) => ({ $regex: new RegExp(v, 'igm') }),
  [OPERATOR.LT]: (v: unknown) => ({ $lt: v }),
  [OPERATOR.LTE]: (v: unknown) => ({ $lte: v }),
  [OPERATOR.GT]: (v: unknown) => ({ $gt: v }),
  [OPERATOR.GTE]: (v: unknown) => ({ $gte: v }),
  [OPERATOR.HAS]: () => ({ $exists: true }),
  [OPERATOR.NOT_HAS]: () => ({ $exists: false })
} as const;

export const OPERATORS_MAP_TO_SCHEMA = <T extends ZodTypeAny>(v: T) => ({
  [OPERATOR.NE]: v.optional(),
  [OPERATOR.EQ]: v.optional(),
  [OPERATOR.IN]: z.array(v).optional(),
  [OPERATOR.NIN]: z.array(v).optional(),
  [OPERATOR.REGEX]: z.string().optional(),
  [OPERATOR.LT]: v.optional(),
  [OPERATOR.LTE]: v.optional(),
  [OPERATOR.GT]: v.optional(),
  [OPERATOR.GTE]: v.optional(),
  [OPERATOR.HAS]: z.array(v).optional(),
  [OPERATOR.NOT_HAS]: z.array(v).optional()
});

export const PRODUCT_SORT_BY = ['name', 'status', 'created_at', 'price'] as const;

export const ORDER_SORT_BY = ['created_at', 'updated_at', 'user_id'];

export const SORT_KEY = {
  ASC: 'asc',
  DESC: 'desc'
} as const;

export const SORT = {
  [SORT_KEY.ASC]: 1,
  [SORT_KEY.DESC]: -1
} as const;

export const SORT_KEYS = [SORT_KEY.ASC, SORT_KEY.DESC] as const;
