import {
  WORKFLOW_RESULT_STATUS_ERROR,
  WORKFLOW_RESULT_STATUS_SUCCESS,
} from './constants';
import { type WorkflowResult } from './types';

export type CreateWorkflowResultProps = {
  readonly exitCode: number;
};

export const createWorkflowResult = (props: CreateWorkflowResultProps) => {
  const { exitCode } = props;
  const status =
    exitCode === 0
      ? WORKFLOW_RESULT_STATUS_SUCCESS
      : WORKFLOW_RESULT_STATUS_ERROR;
  const result: WorkflowResult = {
    status,
    exitCode,
  };

  return result;
};
