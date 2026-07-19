import ky from 'ky';
import { RESULT_STATUS_ERROR } from '@jearle/util-result';

import { type CreateHttpClientProps } from '../types';
import { createKyOptions } from './create-ky-options';
import { normalizeHttpClientOptions } from './normalize-http-client-options';
import { type HttpClientContext } from './types';

export const createHttpClientContext = (
  props: CreateHttpClientProps,
): HttpClientContext => {
  const optionsResult = normalizeHttpClientOptions(props);

  if (optionsResult.status === RESULT_STATUS_ERROR) {
    const ctx: HttpClientContext = {
      kyInstance: null,
      optionsResult,
    };

    return ctx;
  }

  const kyOptions = createKyOptions(optionsResult.data);
  const kyInstance = ky.create(kyOptions);
  const ctx: HttpClientContext = {
    kyInstance,
    optionsResult,
  };

  return ctx;
};
