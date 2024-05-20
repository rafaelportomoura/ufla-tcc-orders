/* eslint-disable guard-for-in */
/* eslint-disable snakecasejs/snakecasejs */
import { expect } from 'chai';
import sinon from 'sinon';
import { Logger } from '../../../src/adapters/logger';
import { LoggerLevel, LoggerLevelTier } from '../../../src/constants/loggerLevel';
import { RecursiveClass } from '../../data/recursiveClass';

describe('Adapters -> Logger', () => {
  beforeEach(sinon.restore);
  for (const level in LoggerLevel) {
    describe(`When log level is ${level}`, () => {
      for (const tier in LoggerLevelTier) {
        if (LoggerLevelTier[tier].includes(LoggerLevel[level]))
          it(`Should log ${tier}`, () => {
            const log_stub = sinon.stub(console, 'log').returns();
            const logger = new Logger(LoggerLevel[level], 'test');
            logger[tier]('test');
            sinon.assert.calledOnce(log_stub);
          });
        else
          it(`Should not log ${tier}`, () => {
            const console_debug = sinon.stub(console, 'log').returns();
            const logger = new Logger(LoggerLevel[level], 'test');
            logger[tier]('test');
            sinon.assert.notCalled(console_debug);
          });
      }
      it('Should parse object', () => {
        const logger = new Logger(LoggerLevel[level], 'test');
        const parsed = logger.parser({ test: 'test' });
        expect(parsed).deep.eq(['[test]', '{"test":"test"}']);
      });
      it('Should parse recursive object', () => {
        const logger = new Logger(LoggerLevel[level], 'test');
        const parsed = logger.parser(new RecursiveClass());
        expect(parsed).deep.eq(['[test]', '[object Object]']);
      });
      it('Should parse recursive object with toString', () => {
        const logger = new Logger(LoggerLevel[level], 'test');
        class Test extends RecursiveClass {
          toString() {
            return 'test';
          }
        }
        const parsed = logger.parser(new Test());
        expect(parsed).deep.eq(['[test]', 'test']);
      });
    });
  }

  it('Unknown level never logged', () => {
    const stub = sinon.stub(console, 'log').returns();
    const logger = new Logger('unknown' as LoggerLevel, 'test');
    logger.error('test');
    sinon.assert.notCalled(stub);
  });
});
