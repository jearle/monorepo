import { type ResultError } from '@jearle/schema-result';

import {
  type RESULT_STATUSES,
  type RESULT_STATUS_ERROR,
  type RESULT_STATUS_SUCCESS,
} from '../constants';

export { type ResultError } from '@jearle/schema-result';

export type ResultStatus = (typeof RESULT_STATUSES)[number];

export type ResultSuccess<TData> = {
  readonly status: typeof RESULT_STATUS_SUCCESS;
  readonly data: TData;
};

export type ResultFailure = {
  readonly status: typeof RESULT_STATUS_ERROR;
  readonly error: ResultError;
};

export type Result<TData> = ResultSuccess<TData> | ResultFailure;

export type AsyncResult<TData> = Promise<Result<TData>>;
