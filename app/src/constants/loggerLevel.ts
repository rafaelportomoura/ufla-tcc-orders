/* eslint-disable no-shadow */
/* eslint-disable snakecasejs/snakecasejs */
export enum LoggerLevel {
  debug = 'debug',
  verbose = 'verbose',
  warn = 'warn',
  info = 'info',
  log = 'log',
  error = 'error',
  silent = 'silent'
}

export const LoggerLevelTier = {
  debug: [LoggerLevel.debug],
  verbose: [LoggerLevel.debug, LoggerLevel.verbose],
  warn: [LoggerLevel.debug, LoggerLevel.verbose, LoggerLevel.warn],
  info: [LoggerLevel.debug, LoggerLevel.verbose, LoggerLevel.warn, LoggerLevel.info],
  log: [LoggerLevel.debug, LoggerLevel.verbose, LoggerLevel.warn, LoggerLevel.info, LoggerLevel.log],
  error: [
    LoggerLevel.debug,
    LoggerLevel.verbose,
    LoggerLevel.warn,
    LoggerLevel.info,
    LoggerLevel.log,
    LoggerLevel.error
  ]
};
