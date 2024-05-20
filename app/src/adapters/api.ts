/* eslint-disable snakecasejs/snakecasejs */
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { isEmpty } from 'lodash';
import qs from 'qs';

export class Api {
  private caller: AxiosInstance;

  constructor(
    private request_id: string,
    config?: AxiosRequestConfig
  ) {
    this.caller = axios.create(config);
  }

  async get<T>(path: string = '', query_parameters: Record<string, unknown> = {}): Promise<T> {
    if (!isEmpty(query_parameters)) path += `?${qs.stringify(query_parameters)}`;

    const response = await this.caller.get<T>(path, {
      headers: { request_id: this.request_id }
    });

    return response.data;
  }

  async post<T>(path: string, body: Record<string, unknown>): Promise<T> {
    const response = await this.caller.post<T>(path, body, {
      headers: { request_id: this.request_id }
    });

    return response.data;
  }
}
