/* eslint-disable import/no-extraneous-dependencies */
import { APIGatewayRequestAuthorizerEvent, APIGatewayTokenAuthorizerEvent, Callback, Context } from 'aws-lambda';
import { log } from 'console';
import { CONFIGURATION } from '../constants/configuration';
import { URLS } from '../constants/urls';
import { ForbiddenError } from '../exceptions/ForbiddenError';
import { UnauthorizedError } from '../exceptions/Unauthorized';
import { OAuthService } from '../services/OAuth';
import { GenerateAuthResponse } from '../utils/generateAuthResponse';

export async function authorizer(
  event: APIGatewayRequestAuthorizerEvent,
  _context: Context,
  callback: Callback
): Promise<unknown> {
  const { headers, methodArn } = event;
  const { authorizationToken: authorization_token } = event as unknown as APIGatewayTokenAuthorizerEvent;

  try {
    const token = headers ? (headers.authorization?.split(' ')[1] as string) : authorization_token.split(' ')[1];

    const authorizer_business = new OAuthService({
      baseURL: URLS(CONFIGURATION).OAUTH
    });

    const { decoded_token, group } = await authorizer_business.validateToken(token);

    if (group !== 'admin') throw new ForbiddenError(decoded_token);

    const authorizer_response = GenerateAuthResponse.success(decoded_token, methodArn);

    return authorizer_response;
  } catch (error) {
    log('Error', error.message);
    if (error instanceof UnauthorizedError) callback('Unauthorized');
    return GenerateAuthResponse.error(error.sub, methodArn);
  }
}
