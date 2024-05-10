/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { BaseError } from './BaseError';

export class ForbiddenError extends BaseError {
  public sub: string;

  constructor(decoded_token: any) {
    super(CODE_MESSAGES.FORBIDDEN, StatusCodes.FORBIDDEN);
    this.sub = decoded_token.sub;
  }
}
