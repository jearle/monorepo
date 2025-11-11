import { type Env } from 'hono';
import { type Hook, z } from '@hono/zod-openapi';

import { type BaseResponse } from '@jearle/schema-api';
import { type ClientError, CLIENT_ERROR_TYPE } from '@jearle/schema-error';

const toMessage = (issues: z.core.$ZodIssue[]) => {
  const message = issues.reduce((accMessage, nextIssue, i) => {
    const { message: issueMessage } = nextIssue;
    if (i === 0) {
      return issueMessage;
    }

    const nextAccMessage = `${accMessage}; ${issueMessage}`;

    return nextAccMessage;
  }, ``);

  return message;
};

export const getDefaultHook = () => {
  const defaultHook: Hook<unknown, Env, string, unknown> = (result, c) => {
    const { success } = result;

    if (success === true) {
      return;
    }

    const { error } = result;
    const { issues } = error;
    const message = toMessage(issues);

    const clientError: ClientError = {
      type: CLIENT_ERROR_TYPE,
      code: `VALIDATION_ERROR`,
      message,
      timestamp: new Date().toISOString(),
      metadata: { issues },
    };
    const response: BaseResponse = {
      clientErrors: [clientError],
      systemErrors: [],
      data: {},
    };

    return c.json(response, 422);
  };

  const result = { defaultHook };

  return result;
};
