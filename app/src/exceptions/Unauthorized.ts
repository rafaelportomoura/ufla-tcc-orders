import { StatusCodes } from 'http-status-codes';
import { CodeMessage } from '../types/CodeMessage';
import { BaseError } from './BaseError';

export class UnauthorizedError extends BaseError {
  constructor(code_message: CodeMessage) {
    super(code_message, StatusCodes.UNAUTHORIZED);
  }
}
