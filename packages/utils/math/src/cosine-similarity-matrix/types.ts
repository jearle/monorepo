import { type SimilarityMatrix } from '../types';
import {
  type MATH_RESULT_STATUS_ERROR,
  type MATH_RESULT_STATUS_SUCCESS,
} from '../constants';

export type CreateCosineSimilarityMatrixData = {
  readonly similarityMatrix: SimilarityMatrix;
};

export type CreateCosineSimilarityMatrixResultFailure = {
  readonly status: typeof MATH_RESULT_STATUS_ERROR;
  readonly error: Error;
};

export type CreateCosineSimilarityMatrixResultSuccess = {
  readonly status: typeof MATH_RESULT_STATUS_SUCCESS;
  readonly data: CreateCosineSimilarityMatrixData;
};

export type CreateCosineSimilarityMatrixResult =
  | CreateCosineSimilarityMatrixResultFailure
  | CreateCosineSimilarityMatrixResultSuccess;
