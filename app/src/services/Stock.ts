import { Api } from '../adapters/api';
import { Logger } from '../adapters/logger';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { InternalServerError } from '../exceptions/InternalServerError';
import { ReserveStockError } from '../exceptions/ReserveStockError';
import { Reserve, ReserveRequest, ReserveResponse, StockServiceConstructor } from '../types/StockService';

export class StockService {
  private api: Api;

  private logger: Logger;

  constructor({ base_url, logger, request_id }: StockServiceConstructor) {
    this.api = new Api(request_id, { baseURL: base_url });
    this.logger = logger;
  }

  async reserve({ products }: ReserveRequest): Promise<Reserve[]> {
    try {
      const response = await this.api.post<ReserveResponse>('reserve', { products });
      this.logger.info({ products, reserves: response.reserves }, 'StockService.reserve');
      return response.reserves;
    } catch (error) {
      this.logger.error(error, 'StockService.reserve');
      if (error.response.data.product_ids) {
        throw new ReserveStockError(error.response.data.product_ids);
      }

      throw new InternalServerError(CODE_MESSAGES.ERROR_CALLING_RESERVE_STOCK_API);
    }
  }
}
