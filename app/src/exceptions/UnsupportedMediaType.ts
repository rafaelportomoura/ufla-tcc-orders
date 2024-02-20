import { HTTP_STATUS_CODE } from '../constants/httpStatus';
import { CodeMessage } from '../types/CodeMessage';
import { BaseError } from './BaseError';

export class UnsupportedMediaTypeError extends BaseError {
  constructor(code_message: CodeMessage) {
    super(code_message, HTTP_STATUS_CODE.UNSUPPORTED_MEDIA_TYPE);
    this.name = 'UnsupportedMediaTypeError';
  }
}
