/* eslint-disable import/no-extraneous-dependencies */
import { APIGatewayRequestAuthorizerEvent, APIGatewayTokenAuthorizerEvent, Callback, Context } from 'aws-lambda';
import { Logger } from '../adapters/logger';
import { Authorizer } from '../business/authorizer';
import { CONFIGURATION } from '../constants/configuration';
import { URLS } from '../constants/urls';
import { UnauthorizedError } from '../exceptions/Unauthorized';
import { OAuthService } from '../services/OAuth';
import { GenerateAuthResponse } from '../utils/generateAuthResponse';
import { request_id } from '../utils/requestId';

export async function authorizer(
  event: APIGatewayRequestAuthorizerEvent,
  _context: Context,
  callback: Callback
): Promise<unknown> {
  const { headers, methodArn } = event;
  const { authorizationToken: authorization_token } = event as unknown as APIGatewayTokenAuthorizerEvent;
  const req_id = request_id({ headers: headers ?? {} });
  const logger = new Logger(CONFIGURATION.LOG_LEVEL, req_id);
  try {
    const token = headers ? (headers.authorization?.split(' ')[1] as string) : authorization_token.split(' ')[1];

    const authorizer_business = new OAuthService(req_id, {
      baseURL: URLS(CONFIGURATION).OAUTH
    });

    const { decoded_token, group } = await authorizer_business.validateToken(token);

    if (group !== 'admin') {
      Authorizer.validate(methodArn, decoded_token);
    }

    const authorizer_response = GenerateAuthResponse.success(decoded_token, methodArn);

    return authorizer_response;
  } catch (error) {
    logger.error('Error', error.message);
    if (error instanceof UnauthorizedError) callback('Unauthorized');
    return GenerateAuthResponse.error(error.sub, methodArn);
  }
}
