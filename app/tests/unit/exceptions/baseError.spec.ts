import { expect } from 'chai';
import { CODE_MESSAGES } from '../../../src/constants/codeMessages';
import { BaseError } from '../../../src/exceptions/BaseError';

const name = 'BaseError';
describe(`Exception -> ${name}`, async () => {
  const error = new BaseError(CODE_MESSAGES.VALIDATION_ERROR, 200);
  it(`Should create a ${name}`, () => expect(error).to.be.instanceOf(BaseError));
  it(`Should have the correct name`, () => expect(error.name).eq(name));
  it(`Should have the correct status`, () => expect(error.status).eq(200));
  it(`Should have the correct code`, () => expect(error.code).eq(CODE_MESSAGES.VALIDATION_ERROR.code));
  it(`Should have the correct message`, () => expect(error.message).eq(CODE_MESSAGES.VALIDATION_ERROR.message));
  it(`Should have the correct toJSON`, () =>
    expect(error.toJSON()).deep.eq({
      code: CODE_MESSAGES.VALIDATION_ERROR.code,
      error: name,
      message: CODE_MESSAGES.VALIDATION_ERROR.message
    }));
  it(`Should have the correct stack`, () => expect(error.stack).to.be.a('string'));
  it(`Should have the correct toString`, () =>
    expect(error.toString()).eq(`${name}: ${CODE_MESSAGES.VALIDATION_ERROR.message}`));
});
