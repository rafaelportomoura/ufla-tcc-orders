import { Logger } from '../adapters/logger';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { BaseError } from '../exceptions/BaseError';
import { InternalServerError } from '../exceptions/InternalServerError';

export const error_handler = (logger: Logger, error: Error, place: string) => {
  logger.error(place, error.message, error);

  if (error instanceof BaseError) {
    return error;
  }

  return new InternalServerError(CODE_MESSAGES.INTERNAL_SERVER_ERROR);
};
