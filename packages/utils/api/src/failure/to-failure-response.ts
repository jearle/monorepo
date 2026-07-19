import {
  type ClientError,
  type ErrorResult,
  CLIENT_ERROR_TYPE,
} from '@jearle/schema-error';
import { type FailureResponse } from '@jearle/schema-api';

export const toFailureResponse = (errorResult: ErrorResult) => {
  const timestamp = new Date().toISOString();
  const { error, code } = errorResult;

  const clientError: ClientError = {
    type: CLIENT_ERROR_TYPE,
    code,
    message: error.message,
    timestamp,
    metadata: null,
  };

  const failureResponse: FailureResponse = {
    clientErrors: [clientError],
    systemErrors: [],
    data: { success: false },
  };

  const result = { failureResponse };

  return result;
};
