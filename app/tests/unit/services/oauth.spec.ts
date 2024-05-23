/* eslint-disable dot-notation */
import { AxiosError } from 'axios';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import sinon from 'sinon';
import { Api } from '../../../src/adapters/api';
import { CODE_MESSAGES } from '../../../src/constants/codeMessages';
import { UnauthorizedError } from '../../../src/exceptions/Unauthorized';
import { OAuthService } from '../../../src/services/OAuth';
import { ValidateToken } from '../../../src/types/ValidateToken';
import { AuthorizerData } from '../../data/authorizer';
import { UserData } from '../../data/user';

describe('Service -> OAuthService', () => {
  let oauth_service: OAuthService;
  let api: sinon.SinonStubbedInstance<Api>;

  const config = { baseURL: 'http://localhost' };

  beforeEach(() => {
    sinon.restore();
    oauth_service = new OAuthService('req', config);
    api = sinon.createStubInstance(Api);
    oauth_service['client'] = api;
  });

  it('should return valid token data when the token is valid', async () => {
    const token = 'valid_token';
    const token_data: ValidateToken = { decoded_token: AuthorizerData.decodedToken(), group: 'group' };
    api.post.resolves(token_data);

    const result = await oauth_service.validateToken(token);

    expect(result).to.deep.equal(token_data);
    expect(api.post.calledOnceWith('/oauth/validate-token', { token })).equal(true);
  });

  it('should throw UnauthorizedError when the token is invalid', async () => {
    const token = 'invalid_token';

    api.post.rejects({ response: { status: StatusCodes.UNAUTHORIZED } as AxiosError });

    try {
      await oauth_service.validateToken(token);
    } catch (err) {
      expect(err).to.be.instanceOf(UnauthorizedError);
      expect(err).deep.equal(new UnauthorizedError(CODE_MESSAGES.UNAUTHORIZED));
      expect(api.post.calledOnceWith('/oauth/validate-token', { token })).equal(true);
    }
  });

  it('should rethrow other errors', async () => {
    const token = 'token';
    const error = new Error('Some other error');
    api.post.rejects(error);

    try {
      await oauth_service.validateToken(token);
    } catch (err) {
      expect(err).to.equal(error);
      expect(api.post.calledOnceWith('/oauth/validate-token', { token })).equal(true);
    }
  });

  it('should get user', async () => {
    const username = UserData.username();
    const user = UserData.user({ username });
    api.get.resolves(user);
    const result = await oauth_service.get(username);

    expect(result).to.deep.equal(user);
    expect(api.get.calledOnceWith(`/users/${username}`)).equal(true);
  });
});
