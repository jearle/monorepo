import { validateEnv } from '@jearle/util-env';

import {
  DEFAULT_CHECK_SHOULD_USE_COLOR_PROPS,
  DEFAULT_TERMINAL_COLOR_ENVIRONMENT,
  DEFAULT_TERMINAL_COLOR_IS_TTY,
} from './constants';
import { TerminalColorEnvironmentSchema } from './terminal-color-schema';
import { type TerminalColorEnvironment } from './types';

export type CheckShouldUseColorProps = {
  readonly env?: TerminalColorEnvironment;
  readonly isTTY?: boolean;
};

export const checkShouldUseColor = (
  props: CheckShouldUseColorProps = DEFAULT_CHECK_SHOULD_USE_COLOR_PROPS,
) => {
  const {
    env: maybeEnv = DEFAULT_TERMINAL_COLOR_ENVIRONMENT,
    isTTY = DEFAULT_TERMINAL_COLOR_IS_TTY,
  } = props;
  const validationResult = validateEnv({
    EnvSchema: TerminalColorEnvironmentSchema,
    env: maybeEnv,
  });
  const env =
    validationResult.success === true
      ? validationResult.env
      : DEFAULT_TERMINAL_COLOR_ENVIRONMENT;
  const { FORCE_COLOR: forceColor, NO_COLOR: noColor } = env;

  if (noColor !== undefined && noColor.length > 0) {
    return false;
  }

  if (forceColor !== undefined) {
    return forceColor !== `0`;
  }

  return isTTY;
};
