import { type Vector } from '../types';

import { getVectorMagnitudeState } from './get-vector-magnitude-state';

export type GetVectorMagnitudeProps = {
  readonly vector: Vector;
};

export const getVectorMagnitude = (props: GetVectorMagnitudeProps) => {
  const magnitudeState = getVectorMagnitudeState(props);
  const { scale, scaledSquareSum } = magnitudeState;
  const hasNoScale = scale === 0;

  if (hasNoScale) {
    return 0;
  }

  const squareRootScaledSquareSum = Math.sqrt(scaledSquareSum);
  const magnitude = scale * squareRootScaledSquareSum;

  return magnitude;
};
