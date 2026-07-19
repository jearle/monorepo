import {
  MATH_RESULT_STATUS_ERROR,
  MATH_RESULT_STATUS_SUCCESS,
} from '../constants';
import { createMismatchedVectorLengthErrorMessage } from '../errors';
import { type Vector } from '../types';

import { type GetDotProductResult } from './types';

export type GetDotProductProps = {
  readonly vector1: Vector;
  readonly vector2: Vector;
};

export const getDotProduct = (props: GetDotProductProps) => {
  const { vector1, vector2 } = props;
  const expectedLength = vector1.length;
  const receivedLength = vector2.length;
  const hasMismatchedLength = expectedLength !== receivedLength;

  if (hasMismatchedLength) {
    const errorMessage = createMismatchedVectorLengthErrorMessage({
      expectedLength,
      receivedLength,
      vectorName: `vector2`,
    });
    const result: GetDotProductResult = {
      status: MATH_RESULT_STATUS_ERROR,
      error: new Error(errorMessage),
    };

    return result;
  }

  const dotProduct = vector1.reduce((sum, value1, valueIndex) => {
    const value2 = vector2[valueIndex];
    const hasValue2 = value2 !== undefined;

    if (hasValue2 === false) {
      return Number.NaN;
    }

    const product = value1 * value2;
    const nextSum = sum + product;

    return nextSum;
  }, 0);
  const result: GetDotProductResult = {
    status: MATH_RESULT_STATUS_SUCCESS,
    data: {
      dotProduct,
    },
  };

  return result;
};
