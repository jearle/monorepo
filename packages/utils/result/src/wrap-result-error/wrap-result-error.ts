import { RESULT_STATUS_ERROR } from '../constants';
import { type ResultError, type ResultFailure } from '../types';

export type WrapResultErrorProps = {
  readonly error: ResultError;
};

export const wrapResultError = (props: WrapResultErrorProps) => {
  const { error } = props;
  const result: ResultFailure = {
    status: RESULT_STATUS_ERROR,
    error,
  };

  return result;
};
