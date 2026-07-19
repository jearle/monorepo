import { Ansis } from 'ansis';

import { type TerminalColorizerResult } from './types';

const createPlainColorizer = (): TerminalColorizerResult => {
  const format = (value: string) => value;
  const result: TerminalColorizerResult = {
    bold: format,
    cyan: format,
    dim: format,
    green: format,
    red: format,
    yellow: format,
  };

  return result;
};

const forcedAnsis = new Ansis(3);
export type CreateTerminalColorizerProps = {
  readonly shouldUseColor?: boolean;
};

export const createTerminalColorizer = (
  props: CreateTerminalColorizerProps = {},
) => {
  const { shouldUseColor = true } = props;

  if (shouldUseColor === false) {
    return createPlainColorizer();
  }

  const result: TerminalColorizerResult = {
    bold: forcedAnsis.bold,
    cyan: forcedAnsis.cyan,
    dim: forcedAnsis.dim,
    green: forcedAnsis.green,
    red: forcedAnsis.red,
    yellow: forcedAnsis.yellow,
  };

  return result;
};
