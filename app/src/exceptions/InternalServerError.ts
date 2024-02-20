import { HTTP_STATUS_CODE } from '../constants/httpStatus';
import { CodeMessage } from '../types/CodeMessage';
import { BaseError } from './BaseError';

export class InternalServerError extends BaseError {
  constructor(code_message: CodeMessage) {
    super(code_message, HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
    this.name = 'InternalServerError';
  }
}
