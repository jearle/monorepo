import {
  PARSE_JSONL_CONTENT_ISSUE_CODE_BLANK_LINE,
  PARSE_JSONL_CONTENT_ISSUE_CODE_INVALID_JSON,
} from './constants';
import {
  type ParseJsonlContentIssue,
  type ParseJsonlContentResult,
} from './types';

const TRAILING_NEWLINE = `\n`;

type CreateBlankLineIssueProps = {
  readonly lineNumber: number;
};

const createBlankLineIssue = (
  props: CreateBlankLineIssueProps,
): ParseJsonlContentIssue => {
  const { lineNumber } = props;
  const result: ParseJsonlContentIssue = {
    code: PARSE_JSONL_CONTENT_ISSUE_CODE_BLANK_LINE,
    lineNumber,
    message: `JSONL line ${lineNumber} is blank.`,
  };

  return result;
};

type CreateInvalidJsonIssueProps = {
  readonly lineNumber: number;
  readonly error: unknown;
};

const createInvalidJsonIssue = (
  props: CreateInvalidJsonIssueProps,
): ParseJsonlContentIssue => {
  const { error, lineNumber } = props;
  const errorMessage = error instanceof Error ? error.message : `Unknown error`;
  const result: ParseJsonlContentIssue = {
    code: PARSE_JSONL_CONTENT_ISSUE_CODE_INVALID_JSON,
    lineNumber,
    message: `JSONL line ${lineNumber} is not valid JSON: ${errorMessage}`,
  };

  return result;
};

type ParseJsonlLineProps = {
  readonly line: string;
  readonly lineNumber: number;
};

type ParseJsonlLineResultSuccess = {
  readonly success: true;
  readonly value: unknown;
};

type ParseJsonlLineResultFailure = {
  readonly issue: ParseJsonlContentIssue;
  readonly success: false;
};

type ParseJsonlLineResult =
  | ParseJsonlLineResultSuccess
  | ParseJsonlLineResultFailure;

const parseJsonlLine = (props: ParseJsonlLineProps): ParseJsonlLineResult => {
  const { line, lineNumber } = props;

  if (line.trim().length === 0) {
    const issue = createBlankLineIssue({ lineNumber });
    const result: ParseJsonlLineResult = {
      issue,
      success: false,
    };
    return result;
  }

  try {
    const value: unknown = JSON.parse(line);
    const result: ParseJsonlLineResult = {
      success: true,
      value,
    };
    return result;
  } catch (error) {
    const issue = createInvalidJsonIssue({ error, lineNumber });
    const result: ParseJsonlLineResult = {
      issue,
      success: false,
    };
    return result;
  }
};

export type ParseJsonlContentProps = {
  readonly content: string;
};

export const parseJsonlContent = (
  props: ParseJsonlContentProps,
): ParseJsonlContentResult => {
  const { content } = props;
  const contentWithoutFinalNewline = content.endsWith(TRAILING_NEWLINE)
    ? content.slice(0, -1)
    : content;
  const lines =
    contentWithoutFinalNewline.length === 0
      ? []
      : contentWithoutFinalNewline.split(TRAILING_NEWLINE);
  let issues: readonly ParseJsonlContentIssue[] = [];
  let values: readonly unknown[] = [];

  for (const [index, line] of lines.entries()) {
    const lineNumber = index + 1;
    const parsedLine = parseJsonlLine({ line, lineNumber });

    if (parsedLine.success === false) {
      issues = [...issues, parsedLine.issue];
    } else {
      values = [...values, parsedLine.value];
    }
  }

  if (issues.length > 0) {
    const result: ParseJsonlContentResult = {
      issues,
      success: false,
    };
    return result;
  }

  const result: ParseJsonlContentResult = {
    lines,
    success: true,
    values,
  };
  return result;
};
