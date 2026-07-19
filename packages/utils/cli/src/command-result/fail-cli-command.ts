import { type CLICommandFailure } from './types';
import { setCLIFailureExitCode } from './set-cli-failure-exit-code';
import { type CLIContext } from '../types';

export type FailCLICommandProps = {
  readonly message: string;
};

export const failCLICommand = (ctx: CLIContext, props: FailCLICommandProps) => {
  void ctx;

  const { message } = props;

  process.stderr.write(`${message}\n`);
  setCLIFailureExitCode();

  const result: CLICommandFailure = {
    success: false,
  };

  return result;
};
