import { CODE_MESSAGES } from '../constants/codeMessages';
import { ConflictError } from './ConflictError';

export class ReserveStockError extends ConflictError {
  constructor(public product_ids: string[]) {
    super(CODE_MESSAGES.NOT_ENOUGH_ITEMS);
  }

  toJSON() {
    const { product_ids } = this;
    return { ...super.toJSON(), product_ids };
  }
}
