import { createError } from '../create-error';

export type CreateErrorMessageWithCauseProps = {
  readonly cause: unknown;
  readonly prefix: string;
};

export const createErrorMessageWithCause = (
  props: CreateErrorMessageWithCauseProps,
) => {
  const { cause, prefix } = props;
  const { message } = createError(cause);
  const result = `${prefix}: ${message}`;

  return result;
};
