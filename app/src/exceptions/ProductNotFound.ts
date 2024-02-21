import { CODE_MESSAGES } from '../constants/codeMessages';
import { NotFoundError } from './NotFoundError';

export class ProductsNotFound extends NotFoundError {
  constructor(public product_ids: string[]) {
    super(CODE_MESSAGES.PRODUCTS_NOT_FOUND);
    this.name = 'ProductsNotFound';
  }

  toJSON() {
    const { product_ids } = this;
    return { ...super.toJSON(), product_ids };
  }
}
