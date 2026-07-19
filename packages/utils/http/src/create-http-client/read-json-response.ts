import { safeParse } from '@jearle/util-json';
import {
  RESULT_STATUS_ERROR,
  createResultSuccess,
  wrapResultError,
} from '@jearle/util-result';

import {
  createHttpEmptyResponseBodyResultError,
  createHttpInvalidJsonResultError,
  createHttpResponseBodyReadResultError,
} from '../errors';

import { type ReadJsonResponseResult } from './types';

const readResponseText = async (response: Response) => {
  try {
    const text = await response.text();
    const result = createResultSuccess({ data: text });

    return result;
  } catch (cause) {
    const error = createHttpResponseBodyReadResultError({ cause });
    const result = wrapResultError({ error });

    return result;
  }
};

export const readJsonResponse = async <TJson = unknown>(
  response: Response,
): Promise<ReadJsonResponseResult<TJson>> => {
  const responseTextResult = await readResponseText(response);

  if (responseTextResult.status === RESULT_STATUS_ERROR) {
    const result = wrapResultError({
      error: responseTextResult.error,
    });

    return result;
  }

  const responseText = responseTextResult.data;

  if (responseText.length === 0) {
    const error = createHttpEmptyResponseBodyResultError();
    const result = wrapResultError({ error });

    return result;
  }

  const parseResult = safeParse<TJson>(responseText);

  if (parseResult.success === false) {
    const error = createHttpInvalidJsonResultError({
      cause: parseResult.error,
    });
    const result = wrapResultError({ error });

    return result;
  }

  const result = createResultSuccess({
    data: parseResult.data,
  });

  return result;
};
