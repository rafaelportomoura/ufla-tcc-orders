import { HTTP_STATUS_CODE } from '../constants/httpStatus';

export type HttpStatusCode = (typeof HTTP_STATUS_CODE)[keyof typeof HTTP_STATUS_CODE];
