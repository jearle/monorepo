import { UndefinedVariableError } from 'liquidjs';

import { checkHasErrorName } from './check-has-error-name';

const LIQUID_UNDEFINED_VARIABLE_ERROR_NAME = `UndefinedVariableError`;

export const checkIsLiquidMissingVariableError = (error: unknown) => {
  const result =
    error instanceof UndefinedVariableError ||
    checkHasErrorName(error, LIQUID_UNDEFINED_VARIABLE_ERROR_NAME);

  return result;
};
