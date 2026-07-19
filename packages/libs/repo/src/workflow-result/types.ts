import { type WORKFLOW_RESULT_STATUSES } from './constants';

export type WorkflowResultStatus = (typeof WORKFLOW_RESULT_STATUSES)[number];

export type WorkflowResult = {
  readonly status: WorkflowResultStatus;
  readonly exitCode: number;
};
