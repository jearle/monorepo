import { RESULT_STATUS_ERROR } from '../constants';
import { type ResultFailure } from '../types';

export type CreateResultErrorProps = {
  readonly code?: string;
  readonly message: string;
};

export const createResultError = (props: CreateResultErrorProps) => {
  const { code, message } = props;

  if (code === undefined) {
    const result: ResultFailure = {
      status: RESULT_STATUS_ERROR,
      error: {
        message,
      },
    };

    return result;
  }

  const result: ResultFailure = {
    status: RESULT_STATUS_ERROR,
    error: {
      message,
      code,
    },
  };

  return result;
};
