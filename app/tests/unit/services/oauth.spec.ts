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

describe('Service -> OAuthService', () => {
  let oauth_service: OAuthService;
  let post: sinon.SinonStub;
  const config = { baseURL: 'http://localhost' };

  beforeEach(() => {
    sinon.restore();
    post = sinon.stub(Api.prototype, 'post');
    oauth_service = new OAuthService('req', config);
  });

  it('should return valid token data when the token is valid', async () => {
    const token = 'valid_token';
    const token_data: ValidateToken = { decoded_token: AuthorizerData.decodedToken(), group: 'group' };
    post.resolves(token_data);

    const result = await oauth_service.validateToken(token);

    expect(result).to.deep.equal(token_data);
    expect(post.calledOnceWith('/oauth/validate-token', { token })).equal(true);
  });

  it('should throw UnauthorizedError when the token is invalid', async () => {
    const token = 'invalid_token';

    post.rejects({ response: { status: StatusCodes.UNAUTHORIZED } as AxiosError });

    try {
      await oauth_service.validateToken(token);
    } catch (err) {
      expect(err).to.be.instanceOf(UnauthorizedError);
      expect(err).deep.equal(new UnauthorizedError(CODE_MESSAGES.UNAUTHORIZED));
      expect(post.calledOnceWith('/oauth/validate-token', { token })).equal(true);
    }
  });

  it('should rethrow other errors', async () => {
    const token = 'token';
    const error = new Error('Some other error');
    post.rejects(error);

    try {
      await oauth_service.validateToken(token);
    } catch (err) {
      expect(err).to.equal(error);
      expect(post.calledOnceWith('/oauth/validate-token', { token })).equal(true);
    }
  });
});
