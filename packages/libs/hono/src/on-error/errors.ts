import { type BaseResponse } from '@jearle/schema-api';
import { type SystemError, SYSTEM_ERROR_TYPE } from '@jearle/schema-error';

export type CreateOnErrorResponseProps = {
  readonly error: Error;
};

export const createOnErrorResponse = (
  props: CreateOnErrorResponseProps,
): BaseResponse => {
  const { error } = props;
  const { message, stack = null } = error;
  const systemError: SystemError = {
    type: SYSTEM_ERROR_TYPE,
    code: `SYSTEM_ERROR`,
    message,
    stack,
    timestamp: new Date().toISOString(),
    metadata: {},
  };

  const result: BaseResponse = {
    clientErrors: [],
    systemErrors: [systemError],
    data: {},
  };

  return result;
};
