import { StatusCodes } from 'http-status-codes';
import { CodeMessage } from '../types/CodeMessage';
import { BaseError } from './BaseError';

export class NotFoundError extends BaseError {
  constructor(code_message: CodeMessage) {
    super(code_message, StatusCodes.NOT_FOUND);
    this.name = 'NotFoundError';
  }
}
