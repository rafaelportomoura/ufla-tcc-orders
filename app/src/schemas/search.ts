import { pick } from 'lodash';
import { Writeable, ZodEnum, ZodNumber, ZodOptional, ZodPipeline, ZodTypeAny, ZodUnion, util, z } from 'zod';
import { OPERATORS, OPERATORS_MAP_TO_SCHEMA, SORT_KEY, SORT_KEYS } from '../constants/search';

export const project_schema = <T extends [string, ...string[]]>(...keys: T) => {
  const obj = {} as Record<
    T[number],
    ZodOptional<ZodUnion<[ZodOptional<ZodPipeline<ZodEnum<['0', '1']>, ZodNumber>>, ZodNumber]>>
  >;
  for (const key of keys) {
    obj[key as T[number]] = z
      .enum(['0', '1'])
      .pipe(z.coerce.number())
      .optional()
      .or(z.number().min(0).max(1))
      .optional();
  }

  return z
    .object(obj)
    .strict()
    .refine((v) => {
      const values = Object.values(v);
      return values.every((a) => a === values[0]);
    }, 'Cannot do inclusion and exclusion projection');
};

export const search_attribute_schema = <
  T extends ZodTypeAny,
  O extends [(typeof OPERATORS)[number], ...(typeof OPERATORS)[number][]]
>(
  schema: T,
  ...operators: O
) => {
  const operators_schema = OPERATORS_MAP_TO_SCHEMA(schema);
  const shape = pick(operators_schema, operators);
  return z.object(shape).strict();
};

export const sort_schema = <T extends [string, ...string[]]>(sort_by: T, def?: Writeable<T>[number]) =>
  z.object({
    sort: z.enum(SORT_KEYS).default(SORT_KEY.ASC),
    sort_by: z.enum(sort_by).default((def ?? sort_by[0]) as util.noUndefined<Writeable<T>[number]>)
  });

export const pagination_schema = z.object({
  page: z.number().int().positive().default(1),
  size: z.number().int().positive().default(10)
});
