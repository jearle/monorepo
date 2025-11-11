import { SSE_FIELD_NAME_DATA } from './constants';

export const createSSEString = (value: string) => {
  const sseString = `${SSE_FIELD_NAME_DATA}: ${value}\n\n`;

  return sseString;
};
