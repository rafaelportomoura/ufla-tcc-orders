import { CONFIGURATION } from './configuration';

export const EVENT = CONFIGURATION.MICROSERVICE;

export const EVENT_TYPE = {
  CREATE: 'created',
  APPROVED: 'approved',
  REJECTED: 'rejected'
} as const;

export const EVENT_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error'
} as const;
