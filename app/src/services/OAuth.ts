import { AxiosError, AxiosRequestConfig } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { Api } from '../adapters/api';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { UnauthorizedError } from '../exceptions/Unauthorized';
import { User } from '../types/User';
import { ValidateToken } from '../types/ValidateToken';

export class OAuthService {
  private client: Api;

  constructor(request_id: string, config: AxiosRequestConfig) {
    this.client = new Api(request_id, config);
  }

  async validateToken(token: string): Promise<ValidateToken> {
    try {
      const response = await this.client.post<ValidateToken>('/oauth/validate-token', { token });
      return response;
    } catch (error) {
      if ((error as AxiosError).response?.status === StatusCodes.UNAUTHORIZED)
        throw new UnauthorizedError(CODE_MESSAGES.UNAUTHORIZED);
      throw error;
    }
  }

  async get(user: string): Promise<User> {
    const response = await this.client.get<User>(`/users/${user}`);
    return response;
  }
}
