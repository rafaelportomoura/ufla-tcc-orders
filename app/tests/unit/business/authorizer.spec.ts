import { expect } from 'chai';
import sinon from 'sinon';
import { Authorizer } from '../../../src/business/authorizer';
import { ForbiddenError } from '../../../src/exceptions/ForbiddenError';
import { AuthorizerData } from '../../data/authorizer';

describe('Business -> Authorizer', async () => {
  beforeEach(() => {
    sinon.restore();
  });
  it('should allow get by user', async () => {
    const response = Authorizer.validate(AuthorizerData.getByUser('user'), AuthorizerData.decodedToken('user'));

    expect(response).equal(undefined);
  });
  it('should not allow diff user', async () => {
    const decoded_token = AuthorizerData.decodedToken('user');
    try {
      Authorizer.validate(AuthorizerData.getByUser('diff'), decoded_token);
    } catch (err) {
      expect(err).deep.equal(new ForbiddenError(decoded_token));
    }
  });
  it('should allow get order', async () => {
    const response = Authorizer.validate(AuthorizerData.get('order', 'user'), AuthorizerData.decodedToken('user'));
    expect(response).equal(undefined);
  });
  it('should not allow get order', async () => {
    const decoded_token = AuthorizerData.decodedToken('user');
    try {
      Authorizer.validate(AuthorizerData.get('', 'diff'), decoded_token);
    } catch (err) {
      expect(err).deep.equal(new ForbiddenError(decoded_token));
    }
  });
  it('should allow create', async () => {
    const response = Authorizer.validate(AuthorizerData.create(), AuthorizerData.decodedToken('user'));

    expect(response).equal(undefined);
  });
});
