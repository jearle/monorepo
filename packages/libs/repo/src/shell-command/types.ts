import { type ExecuteShellCommandProps } from './execute-shell-command';

export type ExecuteShellCommand = (props: ExecuteShellCommandProps) => number;

export type ShellCommandResult = {
  readonly exitCode: number;
};

export type BufferedShellCommandResult = ShellCommandResult;

export type ExecuteBufferedShellCommand = (
  props: ExecuteShellCommandProps,
) => Promise<BufferedShellCommandResult>;

export type ExecuteStreamingShellCommand = (
  props: ExecuteShellCommandProps,
) => Promise<ShellCommandResult>;
