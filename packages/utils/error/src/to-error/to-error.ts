import { type ResultError } from '@jearle/schema-result';

export type ToErrorProps = {
  readonly resultError: ResultError;
};

export const toError = (props: ToErrorProps) => {
  const { resultError } = props;
  const error = new Error(resultError.message);

  if (resultError.code === undefined) {
    return error;
  }

  const result = Object.assign(error, {
    code: resultError.code,
  });

  return result;
};
