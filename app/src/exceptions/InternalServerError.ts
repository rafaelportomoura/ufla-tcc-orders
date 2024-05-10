import { StatusCodes } from 'http-status-codes';
import { CodeMessage } from '../types/CodeMessage';
import { BaseError } from './BaseError';

export class InternalServerError extends BaseError {
  constructor(code_message: CodeMessage) {
    super(code_message, StatusCodes.INTERNAL_SERVER_ERROR);
    this.name = 'InternalServerError';
  }
}
