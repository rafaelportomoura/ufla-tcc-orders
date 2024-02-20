import { ZodType, z } from 'zod';
import { ValidationError } from '../exceptions/ValidationError';

export class Validator {
  static async validate<T>(value_to_check: unknown, schema: ZodType<T>): Promise<z.infer<ZodType<T>>> {
    const result = await schema.safeParseAsync(value_to_check);

    if (result.success) return result.data;

    throw new ValidationError(result.error.format());
  }
}
