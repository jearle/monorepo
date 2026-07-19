import { MATH_RESULT_STATUS_ERROR } from '../constants';
import { getDotProduct, getVectorMagnitudeState } from '../vector';
import { type Vector } from '../types';

export type GetCosineSimilarityValueProps = {
  readonly vector1: Vector;
  readonly vector2: Vector;
};

export const getCosineSimilarityValue = (
  props: GetCosineSimilarityValueProps,
) => {
  const { vector1, vector2 } = props;
  const vector1MagnitudeState = getVectorMagnitudeState({
    vector: vector1,
  });
  const vector2MagnitudeState = getVectorMagnitudeState({
    vector: vector2,
  });
  const vector1Scale = vector1MagnitudeState.scale;
  const vector2Scale = vector2MagnitudeState.scale;
  const scaledVector1 = vector1.map((value) => {
    return value / vector1Scale;
  });
  const scaledVector2 = vector2.map((value) => {
    return value / vector2Scale;
  });
  const dotProductResult = getDotProduct({
    vector1: scaledVector1,
    vector2: scaledVector2,
  });

  if (dotProductResult.status === MATH_RESULT_STATUS_ERROR) {
    return Number.NaN;
  }

  const { dotProduct } = dotProductResult.data;
  const vector1MagnitudeFactor = Math.sqrt(
    vector1MagnitudeState.scaledSquareSum,
  );
  const vector2MagnitudeFactor = Math.sqrt(
    vector2MagnitudeState.scaledSquareSum,
  );
  const scaledMagnitudeProduct =
    vector1MagnitudeFactor * vector2MagnitudeFactor;
  const similarity = dotProduct / scaledMagnitudeProduct;

  return similarity;
};
