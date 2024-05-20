/* eslint-disable @typescript-eslint/no-unused-vars */
import { APIGatewayRequestAuthorizerEvent, Callback, Context } from 'aws-lambda';
import { expect } from 'chai';
import sinon from 'sinon';
import { Authorizer } from '../../../src/business/authorizer';
import { CODE_MESSAGES } from '../../../src/constants/codeMessages';
import { ForbiddenError } from '../../../src/exceptions/ForbiddenError';
import { UnauthorizedError } from '../../../src/exceptions/Unauthorized';
import { authorizer } from '../../../src/handlers/authorizer';
import { OAuthService } from '../../../src/services/OAuth';
import { AuthorizerData } from '../../data/authorizer';

describe('Handlers -> Authorizer', () => {
  let event: APIGatewayRequestAuthorizerEvent;
  let context: Context;
  const callback: Callback = (arg: unknown) => {
    throw new UnauthorizedError(CODE_MESSAGES.UNAUTHORIZED);
  };
  let oauth_service_stub: sinon.SinonStub;
  const token = 'valid_token';
  const decoded_token = AuthorizerData.decodedToken();
  const method_arn = AuthorizerData.create();
  let authorizer_stub: sinon.SinonStub;
  const allow_policy = AuthorizerData.allowPolicyDocument(decoded_token.username, decoded_token.sub, `${method_arn}*`);
  const deny_policy = AuthorizerData.denyPolicyDocument(decoded_token.sub, `${method_arn}*`);

  beforeEach(() => {
    sinon.restore();
    event = {
      headers: { authorization: `Bearer ${token}` },
      methodArn: method_arn
    } as unknown as APIGatewayRequestAuthorizerEvent;
    context = {} as Context;
    sinon.stub(console, 'log');
    oauth_service_stub = sinon.stub(OAuthService.prototype, 'validateToken');
    authorizer_stub = sinon.stub(Authorizer, 'validate');
  });

  it('should return a successful authorization response for a valid token and admin group', async () => {
    oauth_service_stub.resolves({ decoded_token, group: 'admin' });

    const result = await authorizer(event, context, callback).catch((e) => e);

    expect(result).deep.equal(allow_policy);
  });

  it('should return a successful authorization response when is TokenRequest for a valid token and admin group', async () => {
    oauth_service_stub.resolves({ decoded_token, group: 'admin' });

    const result = await authorizer(
      { authorizationToken: token, methodArn: method_arn } as unknown as APIGatewayRequestAuthorizerEvent,
      context,
      callback
    );

    expect(result).deep.equal(allow_policy);
  });

  it('should return an success response for a valid token and non-admin group', async () => {
    oauth_service_stub.resolves({ decoded_token, group: 'customer' });
    authorizer_stub.returns(undefined);

    const result = await authorizer(event, context, callback);

    expect(result).deep.equal(allow_policy);
  });

  it('should return an error response for a non-valid route and non-admin group', async () => {
    oauth_service_stub.resolves({ decoded_token, group: 'customer' });
    authorizer_stub.throws(new ForbiddenError(decoded_token));

    const result = await authorizer(event, context, callback);

    expect(result).deep.equal(deny_policy);
  });

  it('should call callback with UnauthorizedError for an invalid token', async () => {
    const error = new UnauthorizedError(CODE_MESSAGES.UNAUTHORIZED);
    oauth_service_stub.rejects(error);

    const result = await authorizer(event, context, callback).catch((e) => e);

    expect(result).deep.equal(error);
  });
});
