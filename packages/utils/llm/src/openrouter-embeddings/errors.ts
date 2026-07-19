import { z } from 'zod';

const createResponseBody = (json: unknown) => {
  const responseBody = JSON.stringify(json, null, 2);
  const result = responseBody;

  return result;
};

export type CreateRequestErrorMessageProps = {
  readonly responseStatus: number;
  readonly json: unknown;
};

export const createRequestErrorMessage = (
  props: CreateRequestErrorMessageProps,
) => {
  const { responseStatus, json } = props;
  const responseBody = createResponseBody(json);
  const errorParts = [
    `Openrouter embeddings request failed with status ${responseStatus}.`,
    `Response body:`,
    responseBody,
  ];
  const errorMessage = errorParts.join(`\n`);
  const result = errorMessage;

  return result;
};

export type CreateInvalidResponseErrorMessageProps = {
  readonly error: z.ZodError;
  readonly json: unknown;
};

export const createInvalidResponseErrorMessage = (
  props: CreateInvalidResponseErrorMessageProps,
) => {
  const { error, json } = props;
  const prettifiedError = z.prettifyError(error);
  const responseBody = createResponseBody(json);
  const errorParts = [
    `Invalid openrouter embeddings response.`,
    prettifiedError,
    `Response body:`,
    responseBody,
  ];
  const errorMessage = errorParts.join(`\n`);
  const result = errorMessage;

  return result;
};
