import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { UnauthorizedError } from '../exceptions/Unauthorized';
import { ValidateToken } from '../types/ValidateToken';

export class OAuthService {
  private client: AxiosInstance;

  constructor(config: AxiosRequestConfig) {
    this.client = axios.create(config);
  }

  async validateToken(token: string): Promise<ValidateToken> {
    try {
      const response = await this.client.post<ValidateToken>('/oauth/validate-token', { token });
      return response.data;
    } catch (error) {
      if ((error as AxiosError).response?.status === StatusCodes.UNAUTHORIZED)
        throw new UnauthorizedError(CODE_MESSAGES.UNAUTHORIZED);
      throw error;
    }
  }
}
