import { MessageAttributeValue } from '@aws-sdk/client-sns';
import { EVENT_NOTIFICATION, EVENT_STATUS, EVENT_TYPE } from '../constants/event';

export type EventBusMessageAttributes = {
  event: MessageAttributeValue;

  type: MessageAttributeValue;

  status: MessageAttributeValue;

  notification?: MessageAttributeValue;
};

export type EventType = (typeof EVENT_TYPE)[keyof typeof EVENT_TYPE];
export type EventStatus = (typeof EVENT_STATUS)[keyof typeof EVENT_STATUS];
export type EventNotification = (typeof EVENT_NOTIFICATION)[keyof typeof EVENT_NOTIFICATION];
