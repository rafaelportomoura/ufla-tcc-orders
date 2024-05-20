import { EVENT } from '../../src/constants/event';
import { EventBusMessageAttributes, EventStatus, EventType } from '../../src/types/EventBus';

export class EventBusData {
  static messageAttributes(type: EventType, status: EventStatus): EventBusMessageAttributes {
    const attribute_value = (v: string) => ({ DataType: 'String', StringValue: v });
    return {
      event: attribute_value(EVENT),
      type: attribute_value(type),
      status: attribute_value(status)
    };
  }
}
