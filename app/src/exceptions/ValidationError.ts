import { CODE_MESSAGES } from '../constants/codeMessages';
import { BadRequestError } from './BadRequestError';

export class ValidationError<T> extends BadRequestError {
  public issues: T;
  constructor(issues: T) {
    super(CODE_MESSAGES.VALIDATION_ERROR);
    this.name = 'ValidationError';
    this.issues = issues;
  }

  toJSON() {
    const { issues } = this;
    return { ...super.toJSON(), issues };
  }
}
