import { CODE_MESSAGES } from '../constants/codeMessages';
import { ConflictError } from './ConflictError';

export class ReserveStockError extends ConflictError {
  constructor(public product_ids: string[]) {
    super(CODE_MESSAGES.NOT_ENOUGH_ITEMS);
    this.name = 'ReserveStockError';
  }

  toJSON() {
    const { product_ids } = this;
    return { ...super.toJSON(), product_ids };
  }
}
