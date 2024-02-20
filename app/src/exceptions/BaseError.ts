import { CodeMessage } from '../types/CodeMessage';
import { HttpStatusCode } from '../types/HttpStatusCode';

export class BaseError extends Error {
  name: string;

  message: string;

  status: HttpStatusCode;

  code: string;

  constructor({ code, message }: CodeMessage, status: HttpStatusCode) {
    super(message);
    this.name = 'BaseError';
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
