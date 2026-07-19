import { type PARSE_JSONL_CONTENT_ISSUE_CODES } from './constants';

export type CreateJsonlContentResultSuccess = {
  readonly success: true;
  readonly content: string;
  readonly lines: readonly string[];
};

export type CreateJsonlContentResultFailure = {
  readonly success: false;
  readonly error: Error;
};

export type CreateJsonlContentResult =
  | CreateJsonlContentResultSuccess
  | CreateJsonlContentResultFailure;

export type ParseJsonlContentIssueCode =
  (typeof PARSE_JSONL_CONTENT_ISSUE_CODES)[number];

export type ParseJsonlContentIssue = {
  readonly code: ParseJsonlContentIssueCode;
  readonly lineNumber: number;
  readonly message: string;
};

export type ParseJsonlContentResultSuccess = {
  readonly success: true;
  readonly lines: readonly string[];
  readonly values: readonly unknown[];
};

export type ParseJsonlContentResultFailure = {
  readonly success: false;
  readonly issues: readonly ParseJsonlContentIssue[];
};

export type ParseJsonlContentResult =
  | ParseJsonlContentResultSuccess
  | ParseJsonlContentResultFailure;
