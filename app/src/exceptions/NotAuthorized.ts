import { StatusCodes } from 'http-status-codes';
import { CodeMessage } from '../types/CodeMessage';
import { BaseError } from './BaseError';

export class NotAuthorized extends BaseError {
  constructor(code_message: CodeMessage) {
    super(code_message, StatusCodes.NOT_FOUND);
    this.name = 'Unauthorized';
  }
}
