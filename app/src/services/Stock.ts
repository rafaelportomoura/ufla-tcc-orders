import { FastifyBaseLogger } from 'fastify';
import { Api } from '../adapters/api';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { InternalServerError } from '../exceptions/InternalServerError';
import { ReserveStockError } from '../exceptions/ReserveStockError';
import { Reserve, ReserveRequest, ReserveResponse, StockServiceConstructor } from '../types/StockService';

export class StockService {
  private api: Api;

  private logger: FastifyBaseLogger;

  constructor({ base_url, logger }: StockServiceConstructor) {
    this.api = new Api({ baseURL: base_url });
    this.logger = logger;
  }

  async reserve(products: ReserveRequest['products']): Promise<Reserve[]> {
    try {
      const response = await this.api.post<ReserveResponse>('/reserve', { products });

      return response.reserved;
    } catch (error) {
      this.logger.error(error, 'StockService.reserve');
      if (error.response.data.product_ids) {
        throw new ReserveStockError(error.response.data.product_ids);
      }

      throw new InternalServerError(CODE_MESSAGES.ERROR_CALLING_RESERVE_STOCK_API);
    }
  }
}
