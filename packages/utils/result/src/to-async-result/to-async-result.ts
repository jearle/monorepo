import { createResultErrorFromUnknown } from '@jearle/util-error';

import { RESULT_STATUS_SUCCESS } from '../constants';
import { type Result } from '../types';
import { wrapResultError } from '../wrap-result-error';

export type ToAsyncResultProps<TData> = {
  readonly operation: () => Promise<TData>;
};

/**
 * Runs a promise-returning operation and converts thrown failures into a
 * discriminated result object.
 */
export const toAsyncResult = async <TData>(
  props: ToAsyncResultProps<TData>,
): Promise<Result<TData>> => {
  const { operation } = props;

  try {
    const data = await operation();
    const result: Result<TData> = {
      status: RESULT_STATUS_SUCCESS,
      data,
    };
    return result;
  } catch (error) {
    const resultError = createResultErrorFromUnknown({ error });
    const result = wrapResultError({ error: resultError });

    return result;
  }
};
