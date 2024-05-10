import { StatusCodes } from 'http-status-codes';
import { CodeMessage } from '../types/CodeMessage';
import { BaseError } from './BaseError';

export class BadRequestError extends BaseError {
  constructor(code_message: CodeMessage) {
    super(code_message, StatusCodes.BAD_REQUEST);
    this.name = 'BadRequestError';
  }
}
