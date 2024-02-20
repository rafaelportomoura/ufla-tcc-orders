import { z } from 'zod';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { BadRequestError } from './BadRequestError';

export class ValidationError<T> extends BadRequestError {
  constructor(private issues: z.ZodFormattedError<T, string>) {
    super(CODE_MESSAGES.VALIDATION_ERROR);
    this.name = 'ValidationError';
  }

  toJSON() {
    const { issues } = this;
    return { ...super.toJSON(), issues };
  }
}
