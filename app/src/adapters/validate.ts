/* eslint-disable no-empty-function */
import { ZodType, z } from 'zod';
import { ValidationError } from '../exceptions/ValidationError';

export class Validator {
  static async validate<T extends ZodType>(value_to_check: unknown, schema: T): Promise<z.infer<typeof schema>> {
    const result = await schema.safeParseAsync(value_to_check);

    if (result.success) return result.data;

    throw new ValidationError(result.error.formErrors.fieldErrors);
  }
}
