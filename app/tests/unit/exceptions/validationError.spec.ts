import { expect } from 'chai';
import { CODE_MESSAGES } from '../../../src/constants/codeMessages';
import { BadRequestError } from '../../../src/exceptions/BadRequestError';
import { BaseError } from '../../../src/exceptions/BaseError';
import { ValidationError } from '../../../src/exceptions/ValidationError';

const name = 'ValidationError';
describe(`Exception -> ${name}`, async () => {
  const error = new ValidationError({ message: 'Error message' });
  it(`Should create a ${name}`, () => expect(error).to.be.instanceOf(ValidationError));
  it(`Should create a ${name} child of BaseError`, () => expect(error).to.be.instanceOf(BaseError));
  it(`Should create a ${name} child of BadRequestError`, () => expect(error).to.be.instanceOf(BadRequestError));
  it(`Should have the correct name`, () => expect(error.name).eq(name));
  it(`Should have the correct status`, () => expect(error.status).eq(400));
  it(`Should have the correct code`, () => expect(error.code).eq(CODE_MESSAGES.VALIDATION_ERROR.code));
  it(`Should have the correct message`, () => expect(error.message).eq(CODE_MESSAGES.VALIDATION_ERROR.message));
  it(`Should have the correct toJSON`, () =>
    expect(error.toJSON()).deep.eq({
      code: CODE_MESSAGES.VALIDATION_ERROR.code,
      error: name,
      issues: { message: 'Error message' },
      message: CODE_MESSAGES.VALIDATION_ERROR.message
    }));
  it(`Should have the correct stack`, () => expect(error.stack).to.be.a('string'));
  it(`Should have the correct toString`, () =>
    expect(error.toString()).eq(`${name}: ${CODE_MESSAGES.VALIDATION_ERROR.message}`));
});
