import { LoggerLevel } from './loggerLevel';

const set_env = <T = string>(key: string, default_value: T): T => (process.env[key] ?? default_value) as T;
const set_number_env = (key: string, default_value: number) => Number(set_env(key, default_value));
const set_string_env = (key: string, default_value: unknown) => String(set_env(key, default_value));

export const CONFIGURATION = {
  STAGE: set_string_env('STAGE', 'development'),
  TENANT: set_string_env('TENANT', 'tcc'),
  REGION: set_string_env('REGION', 'us-east-2'),
  MICROSERVICE: set_string_env('MICROSERVICE', 'orders'),
  LOG_LEVEL: set_env<LoggerLevel>('LOG_LEVEL', LoggerLevel.debug),
  PROFILE: set_env<string>('PROFILE', ''),
  PORT: set_number_env('PORT', 5000),
  EVENT_BUS: set_string_env('EVENT_BUS', ''),
  DOCUMENT_SECRET: set_string_env('DOCUMENT_SECRET', ''),
  DOCUMENT_PARAMS: set_string_env('DOCUMENT_PARAMS', ''),
  EMAIL_SQS: set_string_env('EMAIL_SQS', ''),
  SELL_TEMPLATE: set_string_env('SELL_TEMPLATE', '')
} as const;
