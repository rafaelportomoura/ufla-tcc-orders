import { LoggerLevel } from '../types/Logger';

const set_env = <T = string>(key: string, default_value: T): T => (process.env[key] || default_value) as T;
const set_number_env = (key: string, default_value: number) => Number(set_env(key, default_value));
const set_string_env = (key: string, default_value: unknown) => String(set_env(key, default_value));

export const CONFIGURATION = {
  STAGE: set_string_env('STAGE', 'development'),
  TENANT: set_string_env('TENANT', 'tcc'),
  REGION: set_string_env('REGION', 'us-east-2'),
  MICROSERVICE: set_string_env('MICROSERVICE', ''),
  LOG_LEVEL: set_env<LoggerLevel>('LOG_LEVEL', 'trace'),
  PORT: set_number_env('PORT', 3000),
  EVENT_BUS: set_string_env('EVENT_BUS', ''),
  DOCUMENT_SECRET: set_string_env('DOCUMENT_SECRET', ''),
  DOCUMENT_PARAMS: set_string_env('DOCUMENT_PARAMS', '')
} as const;
