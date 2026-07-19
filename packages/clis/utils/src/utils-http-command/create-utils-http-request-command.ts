import { type HandlerArgs, defineCommand, option } from '@bunli/core';
import {
  failCLICommand,
  failCLIResultCommand,
  writeCLIJSONOutput,
} from '@jearle/util-cli';
import {
  createHTTPJSONHeaders,
  createHttpClient,
  parseHTTPHeaders,
} from '@jearle/util-http';
import { safeStringify } from '@jearle/util-json';
import { RESULT_STATUS_ERROR } from '@jearle/util-result';
import { z } from 'zod';

import {
  COMMAND_UTILS_HTTP_REQUEST,
  COMMAND_UTILS_HTTP_REQUEST_DESCRIPTION,
} from './constants';
import { createUtilsHTTPResponseOutput } from './create-utils-http-response-output';
import { readUtilsHTTPBody } from './read-utils-http-body';
import { type UtilsCommandContext } from '../utils-command';
type HandlerPropsHandlerArgs = {
  readonly 'body': string | undefined;
  readonly 'body-file': string | undefined;
  readonly 'base-url': string | undefined;
  readonly 'header': string[];
  readonly 'json': string | undefined;
  readonly 'json-file': string | undefined;
  readonly 'json-response': boolean;
  readonly 'max-attempts': number | undefined;
  readonly 'max-retry-delay-ms': number | undefined;
  readonly 'method': string;
  readonly 'retry-delay-jitter': boolean;
  readonly 'retry-delay-ms': number | undefined;
  readonly 'retry-delay-multiplier': number | undefined;
  readonly 'retry-method': string[];
  readonly 'retryable-status': number[];
  readonly 'timeout-ms': number | undefined;
};

type HandlerProps = HandlerArgs<HandlerPropsHandlerArgs>;

export const createUtilsHTTPRequestCommand = (ctx: UtilsCommandContext) => {
  const utilsHTTPRequestCommand = defineCommand({
    name: COMMAND_UTILS_HTTP_REQUEST,
    description: COMMAND_UTILS_HTTP_REQUEST_DESCRIPTION,
    options: {
      [`base-url`]: option(z.string().min(1).optional(), {
        description: `Base URL for relative request URLs`,
      }),
      [`method`]: option(z.string().min(1).default(`get`), {
        description: `HTTP method`,
      }),
      [`header`]: option(z.array(z.string()).default([]), {
        description: `Request header as name:value. Repeatable`,
        repeatable: true,
      }),
      [`body`]: option(z.string().optional(), {
        description: `Request body text`,
      }),
      [`body-file`]: option(z.string().min(1).optional(), {
        description: `Request body file path`,
      }),
      [`json`]: option(z.string().optional(), {
        description: `JSON request body`,
      }),
      [`json-file`]: option(z.string().min(1).optional(), {
        description: `JSON request body file path`,
      }),
      [`json-response`]: option(z.coerce.boolean().default(false), {
        argumentKind: `flag`,
        description: `Parse response as JSON and map non-2xx status to Result errors`,
      }),
      [`timeout-ms`]: option(z.coerce.number().int().positive().optional(), {
        description: `Request timeout in milliseconds`,
      }),
      [`max-attempts`]: option(z.coerce.number().int().positive().optional(), {
        description: `Maximum request attempts`,
      }),
      [`retry-delay-ms`]: option(z.coerce.number().min(0).optional(), {
        description: `Initial retry delay in milliseconds`,
      }),
      [`max-retry-delay-ms`]: option(z.coerce.number().min(0).optional(), {
        description: `Maximum retry delay in milliseconds`,
      }),
      [`retry-delay-multiplier`]: option(z.coerce.number().min(1).optional(), {
        description: `Retry delay multiplier`,
      }),
      [`retry-delay-jitter`]: option(z.coerce.boolean().default(true), {
        argumentKind: `flag`,
        description: `Apply retry delay jitter`,
      }),
      [`retry-method`]: option(z.array(z.string().min(1)).default([]), {
        description: `Retryable method. Repeatable`,
        repeatable: true,
      }),
      [`retryable-status`]: option(
        z.array(z.coerce.number().int()).default([]),
        {
          description: `Retryable HTTP status. Repeatable`,
          repeatable: true,
        },
      ),
    },
    handler: async (props: HandlerProps) => {
      const { cwd, flags, positional } = props;
      const [url] = positional;

      if (url === undefined) {
        failCLICommand(ctx, { message: `Provide a request URL` });
        return;
      }

      const headersResult = parseHTTPHeaders({
        headers: flags.header,
      });

      if (headersResult.status === RESULT_STATUS_ERROR) {
        failCLIResultCommand(ctx, { error: headersResult.error });
        return;
      }

      const bodyResult = await readUtilsHTTPBody(ctx, {
        body: flags.body,
        bodyFile: flags[`body-file`],
        cwd,
        json: flags.json,
        jsonFile: flags[`json-file`],
      });

      if (bodyResult.success === false) {
        return;
      }

      const headers = { ...headersResult.data };
      const method = flags.method.toUpperCase();
      const { httpClient } = createHttpClient({
        baseUrl: flags[`base-url`],
        headers,
        maxAttempts: flags[`max-attempts`],
        maxRetryDelayMs: flags[`max-retry-delay-ms`],
        retryDelayJitter: flags[`retry-delay-jitter`],
        retryDelayMs: flags[`retry-delay-ms`],
        retryDelayMultiplier: flags[`retry-delay-multiplier`],
        retryMethods:
          flags[`retry-method`].length === 0
            ? undefined
            : flags[`retry-method`],
        retryableStatuses:
          flags[`retryable-status`].length === 0
            ? undefined
            : flags[`retryable-status`],
        timeoutMs: flags[`timeout-ms`],
      });

      if (flags[`json-response`] === true) {
        const requestHeaders =
          bodyResult.data.json === undefined
            ? headers
            : createHTTPJSONHeaders({ headers });
        const result = await httpClient.fetchJson(url, {
          body: bodyResult.data.body,
          headers: requestHeaders,
          json: bodyResult.data.json,
          method,
        });

        if (result.status === RESULT_STATUS_ERROR) {
          failCLIResultCommand(ctx, { error: result.error });
          return;
        }

        const output = {
          body: result.data.json,
          headers: Object.fromEntries(result.data.response.headers.entries()),
          status: result.data.response.status,
          statusText: result.data.response.statusText,
        };

        writeCLIJSONOutput(ctx, { data: output });
        return;
      }

      if (bodyResult.data.json !== undefined) {
        const stringifyResult = safeStringify(bodyResult.data.json);

        if (stringifyResult.success === false) {
          failCLICommand(ctx, { message: stringifyResult.error.message });
          return;
        }

        const result = await httpClient.fetch(url, {
          body: stringifyResult.data,
          headers: createHTTPJSONHeaders({ headers }),
          method,
        });

        if (result.status === RESULT_STATUS_ERROR) {
          failCLIResultCommand(ctx, { error: result.error });
          return;
        }

        const output = await createUtilsHTTPResponseOutput(result.data);

        writeCLIJSONOutput(ctx, { data: output });
        return;
      }

      const result = await httpClient.fetch(url, {
        body: bodyResult.data.body,
        headers,
        method,
      });

      if (result.status === RESULT_STATUS_ERROR) {
        failCLIResultCommand(ctx, { error: result.error });
        return;
      }

      const output = await createUtilsHTTPResponseOutput(result.data);

      writeCLIJSONOutput(ctx, { data: output });
    },
  });
  const result = { utilsHTTPRequestCommand };

  return result;
};
