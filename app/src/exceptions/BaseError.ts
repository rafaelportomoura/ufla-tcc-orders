import { StatusCodes } from 'http-status-codes';
import { CodeMessage } from '../types/CodeMessage';

export class BaseError extends Error {
  name: string;

  message: string;

  status: StatusCodes;

  code: string;

  constructor({ code, message }: CodeMessage, status: StatusCodes) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.code = code;
    this.status = status;
  }

  toString() {
    return `${this.name}: ${this.message}`;
  }

  toJSON() {
    const { message, code, name } = this;
    return { code, message, error: name };
  }
}
