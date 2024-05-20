/* eslint-disable lines-between-class-members */
/* eslint-disable import/no-extraneous-dependencies */
import { faker } from '@faker-js/faker';

export class AuthorizerData {
  static methodArn(method: string, path: string): string {
    return `arn:aws:execute-api:us-east-1:123456789012:api-id/dev/${method}${path}`;
  }
  static create(): string {
    return AuthorizerData.methodArn('POST', '/');
  }
  static getByUser(username: string = ':username'): string {
    return AuthorizerData.methodArn('GET', `/users/${username}`);
  }
  static get(order_id: string = ':order_id', username: string = ':username'): string {
    return AuthorizerData.methodArn('GET', `/${order_id}/users/${username}`);
  }
  static allArns(): string[] {
    return [AuthorizerData.create()];
  }

  static decodedToken(username: string = faker.internet.userName()) {
    return {
      username,
      sub: 'sub',
      iss: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_334NEqSbZ',
      token_use: 'access',
      auth_time: 1633344000,
      exp: 1633347600,
      iat: 1633344000,
      jti: 'jti',
      client_id: '601r8kvmslt416fv8829shkiai',
      scope: 'scope',
      origin_jti: 'origin_jti',
      event_id: 'event_id',
      version: 2
    };
  }

  static policyDocument(effect: string, sub: string, arn: string) {
    return {
      principalId: sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: effect,
            Resource: arn
          }
        ]
      }
    };
  }

  static denyPolicyDocument(sub: string, arn: string): unknown {
    return this.policyDocument('Deny', sub, arn);
  }

  static allowPolicyDocument(username: string, sub: string, arn: string): unknown {
    return { ...this.policyDocument('Allow', sub, arn), context: { headers: JSON.stringify({ username }) } };
  }
}
