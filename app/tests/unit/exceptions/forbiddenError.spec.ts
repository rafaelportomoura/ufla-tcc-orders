import { expect } from 'chai';
import { CODE_MESSAGES } from '../../../src/constants/codeMessages';
import { BaseError } from '../../../src/exceptions/BaseError';
import { ForbiddenError } from '../../../src/exceptions/ForbiddenError';
import { AuthorizerData } from '../../data/authorizer';

const name = 'ForbiddenError';
describe(`Exception -> ${name}`, async () => {
  const decoded_token = AuthorizerData.decodedToken('username');
  const error = new ForbiddenError(decoded_token);
  it(`Should create a ${name}`, () => expect(error).to.be.instanceOf(ForbiddenError));
  it(`Should create a ${name} child of BaseError`, () => expect(error).to.be.instanceOf(BaseError));
  it(`Should have the correct name`, () => expect(error.name).eq(name));
  it(`Should have the correct sub`, () => expect(error.sub).eq(decoded_token.sub));
  it(`Should have the correct status`, () => expect(error.status).eq(403));
  it(`Should have the correct code`, () => expect(error.code).eq(CODE_MESSAGES.FORBIDDEN.code));
  it(`Should have the correct message`, () => expect(error.message).eq(CODE_MESSAGES.FORBIDDEN.message));
  it(`Should have the correct toJSON`, () =>
    expect(error.toJSON()).deep.eq({
      code: CODE_MESSAGES.FORBIDDEN.code,
      error: name,
      message: CODE_MESSAGES.FORBIDDEN.message
    }));
  it(`Should have the correct stack`, () => expect(error.stack).to.be.a('string'));
  it(`Should have the correct toString`, () =>
    expect(error.toString()).eq(`${name}: ${CODE_MESSAGES.FORBIDDEN.message}`));
});
