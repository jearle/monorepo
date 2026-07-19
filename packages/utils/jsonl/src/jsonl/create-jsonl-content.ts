import {
  type CreateJsonlContentResult,
  type CreateJsonlContentResultFailure,
  type CreateJsonlContentResultSuccess,
} from './types';
import { stringifyJsonlLine } from './stringify-jsonl-line';

const createFailureResult = (error: Error): CreateJsonlContentResultFailure => {
  const result: CreateJsonlContentResultFailure = {
    error,
    success: false,
  };

  return result;
};

const createSuccessResult = (
  lines: readonly string[],
): CreateJsonlContentResultSuccess => {
  const content =
    lines.length === 0
      ? ``
      : `${lines.join(`\n`)}
`;
  const result: CreateJsonlContentResultSuccess = {
    success: true,
    content,
    lines,
  };

  return result;
};

export type CreateJsonlContentProps = {
  readonly values: readonly unknown[];
};

export const createJsonlContent = (
  props: CreateJsonlContentProps,
): CreateJsonlContentResult => {
  const { values } = props;
  let lines: readonly string[] = [];

  for (const value of values) {
    const lineResult = stringifyJsonlLine({ value });

    if (lineResult.success === false) {
      const result = createFailureResult(lineResult.error);
      return result;
    }

    lines = [...lines, lineResult.data];
  }

  const result = createSuccessResult(lines);
  return result;
};
