import { expect } from 'chai';
import Sinon from 'sinon';
import { Logger } from '../../../src/adapters/logger';
import { CODE_MESSAGES } from '../../../src/constants/codeMessages';
import { LoggerLevel } from '../../../src/constants/loggerLevel';
import { InternalServerError } from '../../../src/exceptions/InternalServerError';
import { ValidationError } from '../../../src/exceptions/ValidationError';
import { error_handler } from '../../../src/middlewares/error';

describe('Middleware -> Errors ', () => {
  it('Should return 500 if no error status is provided', () => {
    Sinon.restore();
    const logger = new Logger(LoggerLevel.silent, 'error');
    const spy_logger = Sinon.spy(logger, 'error');
    const message = 'Error message';
    const error = new Error(message);
    const place = 'Place';

    const result = error_handler(logger, error, place);

    expect(spy_logger.args).deep.equal([[place, 'Error message', error]]);
    expect(result).deep.equal(new InternalServerError(CODE_MESSAGES.INTERNAL_SERVER_ERROR));
  });
  it('Should return the error if it is an instance of BaseError', () => {
    Sinon.restore();
    const logger = new Logger(LoggerLevel.silent, 'error');
    const spy_logger = Sinon.spy(logger, 'error');
    const message = 'Error message';
    const error = new ValidationError(message);
    const place = 'Place';

    const result = error_handler(logger, error, place);

    expect(spy_logger.args).deep.equal([[place, error.message, error]]);
    expect(result).deep.equal(new ValidationError(message));
  });
});
