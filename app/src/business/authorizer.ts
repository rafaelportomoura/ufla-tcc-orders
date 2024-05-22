/* eslint-disable no-empty-function */

import { pathToRegexp } from 'path-to-regexp';
import { ForbiddenError } from '../exceptions/ForbiddenError';
import { ValidateToken } from '../types/ValidateToken';

export class Authorizer {
  static validate(method_arn: string, decoded_token: ValidateToken['decoded_token']): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, __, method, ...path] = method_arn.split('/');
    const method_path = [method, ...path].join('/');
    const username = encodeURIComponent(decoded_token.username);

    if (pathToRegexp(`POST/`).test(method_path)) return;

    if (pathToRegexp(`GET/users/${username}`).test(method_path)) return;

    if (pathToRegexp(`GET/:order_id/users/${username}`).test(method_path)) return;

    throw new ForbiddenError(decoded_token);
  }
}
