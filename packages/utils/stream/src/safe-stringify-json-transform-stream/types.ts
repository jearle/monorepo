import type {
  JSONStringifyResultSuccess,
  JSONStringifyResultFailure,
} from '@jearle/util-json';

export type JSONStringifyStreamInput = {
  readonly data: unknown;
};

export type JSONStringifyStreamSuccessOutput = JSONStringifyResultSuccess;
export type JSONStringifyStreamFailureOutput = JSONStringifyResultFailure;

export type JSONStringifyStreamOutput =
  | JSONStringifyStreamSuccessOutput
  | JSONStringifyStreamFailureOutput;
