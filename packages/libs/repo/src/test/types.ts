import { type ExecuteShellCommand } from '../shell-command';
import { type WorkflowResult } from '../workflow-result';

export type TestOptions = {
  readonly runCommand?: ExecuteShellCommand;
};

export type TestResult = WorkflowResult;
