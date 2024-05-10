import { StatusCodes } from 'http-status-codes';
import { CodeMessage } from '../types/CodeMessage';
import { BaseError } from './BaseError';

export class UnsupportedMediaTypeError extends BaseError {
  constructor(code_message: CodeMessage) {
    super(code_message, StatusCodes.UNSUPPORTED_MEDIA_TYPE);
    this.name = 'UnsupportedMediaTypeError';
  }
}
