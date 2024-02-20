import { CodeMessage } from '../types/CodeMessage';
import { InternalServerError } from './InternalServerError';

export class DatabaseError extends InternalServerError {
  constructor(code_message: CodeMessage) {
    super(code_message);
    this.name = 'DatabaseError';
  }
}
