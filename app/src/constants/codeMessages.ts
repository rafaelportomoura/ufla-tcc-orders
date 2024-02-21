import { CONFIGURATION } from './configuration';

const prefix = (code: number) => `${CONFIGURATION.MICROSERVICE}-${String(code).padStart(4, '0')}`;

let n = 0;

export const CODE_MESSAGES = {
  INTERNAL_SERVER_ERROR: {
    code: prefix(n++),
    message: 'Internal Server Error!'
  },
  CANNOT_ACCESS_DATABASE: {
    code: prefix(n++),
    message: 'Cannot access database!'
  },
  VALIDATION_ERROR: {
    code: prefix(n++),
    message: 'Validation Error!'
  },
  NOT_FOUND_ERROR: {
    code: prefix(n++),
    message: 'Not Found Error!'
  },
  NOT_ENOUGH_ITEMS: {
    code: prefix(n++),
    message: 'Not enough items!'
  },
  ERROR_CALLING_RESERVE_STOCK_API: {
    code: prefix(n++),
    message: 'Error when call reserve stock api!'
  },
  PRODUCTS_NOT_FOUND: {
    code: prefix(n++),
    message: 'Products not found!'
  },
  ERROR_CALLING_LIST_PRODUCT_API: {
    code: prefix(n++),
    message: 'Error when calling list product api!'
  }
} as const;
