/* eslint-disable no-use-before-define */
import { isEmpty } from 'lodash';
import { ParsedQs } from 'qs';

export function decodeObject(obj: unknown): Record<string, unknown> {
  if (isEmpty(obj)) return {};

  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (typeof value === 'object')
      (obj as Record<string, unknown>)[key] = Array.isArray(value) ? decodeArray(value) : decodeObject(value);
    else (obj as Record<string, unknown>)[key] = decodeURIComponent(value as string);
  }

  return obj as Record<string, unknown>;
}

export function decodeArray(array: unknown[]): unknown[] {
  return array.map((v) => {
    if (typeof v === 'object') return Array.isArray(v) ? decodeArray(v) : decodeObject(v);
    return decodeURIComponent(v as string);
  }) as ParsedQs[];
}
