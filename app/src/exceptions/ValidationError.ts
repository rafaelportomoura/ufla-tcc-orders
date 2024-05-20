import { CODE_MESSAGES } from '../constants/codeMessages';
import { BadRequestError } from './BadRequestError';

export class ValidationError extends BadRequestError {
  public issues: unknown;

  constructor(issues: unknown) {
    super(CODE_MESSAGES.VALIDATION_ERROR);
    this.issues = issues;
  }

  toJSON() {
    const { issues } = this;
    return { ...super.toJSON(), issues };
  }
}
