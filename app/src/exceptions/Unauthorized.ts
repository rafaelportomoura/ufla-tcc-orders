import { StatusCodes } from 'http-status-codes';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { CodeMessage } from '../types/CodeMessage';
import { BaseError } from './BaseError';

export class UnauthorizedError extends BaseError {
  constructor(code_message: CodeMessage = CODE_MESSAGES.UNAUTHORIZED) {
    super(code_message, StatusCodes.UNAUTHORIZED);
  }
}
