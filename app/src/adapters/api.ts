import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { isEmpty } from 'lodash';
import qs from 'qs';

export class Api {
  private caller: AxiosInstance;

  constructor(config?: AxiosRequestConfig) {
    this.caller = axios.create(config);
  }

  async get<Response>(path: string = '', query_parameters: Record<string, unknown> = {}): Promise<Response> {
    if (!isEmpty(query_parameters)) path += `?${qs.stringify(query_parameters)}`;

    const response = await this.caller.get<Response>(path);

    return response.data;
  }

  async post<Response>(path: string, data: unknown): Promise<Response> {
    const response = await this.caller.post<Response>(path, data);

    return response.data;
  }
}
