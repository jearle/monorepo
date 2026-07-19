import { type ResultError } from '@jearle/schema-result';

import { createError } from '../create-error';

export type CreateResultErrorFromUnknownProps = {
  readonly code?: string;
  readonly error: unknown;
};

export const createResultErrorFromUnknown = (
  props: CreateResultErrorFromUnknownProps,
) => {
  const { code, error } = props;
  const { message } = createError(error);

  if (code === undefined) {
    const result: ResultError = {
      message,
    };

    return result;
  }

  const result: ResultError = {
    message,
    code,
  };

  return result;
};
