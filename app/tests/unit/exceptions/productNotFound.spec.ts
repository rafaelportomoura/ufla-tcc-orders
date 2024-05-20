import { expect } from 'chai';
import { CODE_MESSAGES } from '../../../src/constants/codeMessages';
import { BaseError } from '../../../src/exceptions/BaseError';
import { ProductsNotFound } from '../../../src/exceptions/ProductNotFound';

const name = 'ProductsNotFound';
describe(`Exception -> ${name}`, async () => {
  const error = new ProductsNotFound(['1']);
  it(`Should create a ${name}`, () => expect(error).to.be.instanceOf(ProductsNotFound));
  it(`Should create a ${name} child of BaseError`, () => expect(error).to.be.instanceOf(BaseError));
  it(`Should have the correct name`, () => expect(error.name).eq(name));
  it(`Should have the correct status`, () => expect(error.status).eq(404));
  it(`Should have the correct code`, () => expect(error.code).eq(CODE_MESSAGES.PRODUCTS_NOT_FOUND.code));
  it(`Should have the correct message`, () => expect(error.message).eq(CODE_MESSAGES.PRODUCTS_NOT_FOUND.message));
  it(`Should have the correct toJSON`, () =>
    expect(error.toJSON()).deep.eq({
      code: CODE_MESSAGES.PRODUCTS_NOT_FOUND.code,
      error: name,
      message: CODE_MESSAGES.PRODUCTS_NOT_FOUND.message,
      product_ids: ['1']
    }));
  it(`Should have the correct stack`, () => expect(error.stack).to.be.a('string'));
  it(`Should have the correct toString`, () =>
    expect(error.toString()).eq(`${name}: ${CODE_MESSAGES.PRODUCTS_NOT_FOUND.message}`));
});
