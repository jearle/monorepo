import { type Vector } from '../types';

type VectorMagnitudeState = {
  readonly scale: number;
  readonly scaledSquareSum: number;
};
export type GetVectorMagnitudeStateProps = {
  readonly vector: Vector;
};

export const getVectorMagnitudeState = (
  props: GetVectorMagnitudeStateProps,
) => {
  const { vector } = props;
  const initialState: VectorMagnitudeState = {
    scale: 0,
    scaledSquareSum: 0,
  };
  const magnitudeState = vector.reduce((state, value) => {
    const absoluteValue = Math.abs(value);
    const isZeroValue = absoluteValue === 0;

    if (isZeroValue) {
      return state;
    }

    const { scale, scaledSquareSum } = state;
    const hasNoScale = scale === 0;

    if (hasNoScale) {
      const result = {
        scale: absoluteValue,
        scaledSquareSum: 1,
      };

      return result;
    }

    const hasLargerScale = absoluteValue > scale;

    if (hasLargerScale) {
      const scaleRatio = scale / absoluteValue;
      const scaleRatioSquared = scaleRatio * scaleRatio;
      const nextScaledSquareSum = 1 + scaledSquareSum * scaleRatioSquared;

      const result = {
        scale: absoluteValue,
        scaledSquareSum: nextScaledSquareSum,
      };

      return result;
    }

    const valueRatio = absoluteValue / scale;
    const valueRatioSquared = valueRatio * valueRatio;
    const nextScaledSquareSum = scaledSquareSum + valueRatioSquared;

    const result = {
      scale,
      scaledSquareSum: nextScaledSquareSum,
    };

    return result;
  }, initialState);

  return magnitudeState;
};
