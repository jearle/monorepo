import {
  type MATH_RESULT_STATUS_ERROR,
  type MATH_RESULT_STATUS_SUCCESS,
} from '../constants';

export type GetCosineSimilarityData = {
  readonly similarity: number;
};

export type GetCosineSimilarityResultFailure = {
  readonly status: typeof MATH_RESULT_STATUS_ERROR;
  readonly error: Error;
};

export type GetCosineSimilarityResultSuccess = {
  readonly status: typeof MATH_RESULT_STATUS_SUCCESS;
  readonly data: GetCosineSimilarityData;
};

export type GetCosineSimilarityResult =
  | GetCosineSimilarityResultFailure
  | GetCosineSimilarityResultSuccess;
