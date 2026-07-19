import { defineGroup } from '@bunli/core';

import {
  COMMAND_UTILS_HTTP,
  COMMAND_UTILS_HTTP_DESCRIPTION,
} from './constants';
import { createUtilsHTTPRequestCommand } from './create-utils-http-request-command';
import { type UtilsCommandContext } from '../utils-command';

export const createUtilsHTTPCommand = (ctx: UtilsCommandContext) => {
  const { utilsHTTPRequestCommand } = createUtilsHTTPRequestCommand(ctx);
  const utilsHTTPCommand = defineGroup({
    name: COMMAND_UTILS_HTTP,
    description: COMMAND_UTILS_HTTP_DESCRIPTION,
    commands: [utilsHTTPRequestCommand],
  });
  const result = { utilsHTTPCommand };

  return result;
};
