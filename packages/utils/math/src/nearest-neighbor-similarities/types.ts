import {
  type MATH_RESULT_STATUS_ERROR,
  type MATH_RESULT_STATUS_SUCCESS,
} from '../constants';

export type GetNearestNeighborSimilaritiesData = {
  readonly nearestNeighborSimilarities: readonly number[];
};

export type GetNearestNeighborSimilaritiesResultFailure = {
  readonly status: typeof MATH_RESULT_STATUS_ERROR;
  readonly error: Error;
};

export type GetNearestNeighborSimilaritiesResultSuccess = {
  readonly status: typeof MATH_RESULT_STATUS_SUCCESS;
  readonly data: GetNearestNeighborSimilaritiesData;
};

export type GetNearestNeighborSimilaritiesResult =
  | GetNearestNeighborSimilaritiesResultFailure
  | GetNearestNeighborSimilaritiesResultSuccess;
