import { ParseError, TokenizationError } from 'liquidjs';

import { checkHasErrorName } from './check-has-error-name';

const LIQUID_PARSE_ERROR_NAME = `ParseError`;
const LIQUID_TOKENIZATION_ERROR_NAME = `TokenizationError`;

const checkIsLiquidParseErrorAtDepth = (
  error: unknown,
  depth: number,
): boolean => {
  if (depth >= 8) {
    return false;
  }

  const isParseError =
    error instanceof ParseError ||
    error instanceof TokenizationError ||
    checkHasErrorName(error, LIQUID_PARSE_ERROR_NAME) ||
    checkHasErrorName(error, LIQUID_TOKENIZATION_ERROR_NAME);

  if (isParseError || typeof error !== `object` || error === null) {
    return isParseError;
  }

  const originalError: unknown = Reflect.get(error, `originalError`);
  const cause: unknown = Reflect.get(error, `cause`);
  const result: boolean =
    checkIsLiquidParseErrorAtDepth(originalError, depth + 1) ||
    checkIsLiquidParseErrorAtDepth(cause, depth + 1);

  return result;
};

export const checkIsLiquidParseError = (error: unknown) => {
  const result: boolean = checkIsLiquidParseErrorAtDepth(error, 0);

  return result;
};
