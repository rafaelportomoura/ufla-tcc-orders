/* eslint-disable no-console */
import { LoggerLevel, LoggerLevelTier } from '../constants/loggerLevel';

export class Logger {
  level: LoggerLevel;

  constructor(
    level: LoggerLevel,
    private id: unknown
  ) {
    this.level = level;
  }

  debug(...args: unknown[]) {
    if (!LoggerLevelTier.debug.includes(this.level)) return;
    console.log('🔎 DEBUG', ...this.parser(...args));
  }

  verbose(...args: unknown[]) {
    if (!LoggerLevelTier.verbose.includes(this.level)) return;
    console.log('🗣 VERBOSE', ...this.parser(...args));
  }

  warn(...args: unknown[]) {
    if (!LoggerLevelTier.warn.includes(this.level)) return;
    console.log('⚠ WARN', ...this.parser(...args));
  }

  info(...args: unknown[]) {
    if (!LoggerLevelTier.info.includes(this.level)) return;
    console.log('🔈 INFO', ...this.parser(...args));
  }

  log(...args: unknown[]) {
    if (!LoggerLevelTier.log.includes(this.level)) return;
    console.log(...this.parser(...args));
  }

  error(...args: unknown[]) {
    if (!LoggerLevelTier.error.includes(this.level)) return;
    console.log('❌ ERROR', ...this.parser(...args));
  }

  parser(...args: unknown[]) {
    return [`[${this.id}]`, ...args.map((arg) => this.stringify(arg))];
  }

  stringify(arg: unknown) {
    if (typeof arg === 'string') return arg;

    try {
      return JSON.stringify(arg);
    } catch {
      return arg?.toString();
    }
  }
}
