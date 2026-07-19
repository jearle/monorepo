import { type Input } from 'ky';

import { type HttpFetchInput } from '../types';
import { checkIsAbsoluteUrl } from './check-is-absolute-url';

export const resolveHttpInput = (
  input: HttpFetchInput,
  baseUrl: string | undefined,
): Input => {
  const shouldResolve =
    typeof input === `string` &&
    baseUrl !== undefined &&
    checkIsAbsoluteUrl(input) === false;

  if (shouldResolve) {
    const result = new URL(input, baseUrl).toString();

    return result;
  }

  return input;
};
