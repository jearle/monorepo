import {
  type MATH_RESULT_STATUS_ERROR,
  type MATH_RESULT_STATUS_SUCCESS,
} from '../constants';

export type GetDotProductData = {
  readonly dotProduct: number;
};

export type GetDotProductResultFailure = {
  readonly status: typeof MATH_RESULT_STATUS_ERROR;
  readonly error: Error;
};

export type GetDotProductResultSuccess = {
  readonly status: typeof MATH_RESULT_STATUS_SUCCESS;
  readonly data: GetDotProductData;
};

export type GetDotProductResult =
  | GetDotProductResultFailure
  | GetDotProductResultSuccess;
