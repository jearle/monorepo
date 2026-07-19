import { checkUsesNomicBehavior } from './check-uses-nomic-behavior';
import { type EmbeddingVector } from './types';

const NOMIC_LAYER_NORM_EPSILON = 1e-5;
const VECTOR_NORM_EPSILON = 1e-12;

const getAverage = (values: readonly number[]) => {
  const sum = values.reduce((total, value) => {
    const result = total + value;

    return result;
  }, 0);
  const average = sum / values.length;
  const result = average;

  return result;
};

const layerNormalizeVector = (vector: EmbeddingVector) => {
  const mean = getAverage(vector);
  const squaredDiffs = vector.map((value) => {
    const diff = value - mean;
    const squaredDiff = diff * diff;
    const result = squaredDiff;

    return result;
  });
  const variance = getAverage(squaredDiffs);
  const denominator = Math.sqrt(variance + NOMIC_LAYER_NORM_EPSILON);
  const normalizedVector = vector.map((value) => {
    const centeredValue = value - mean;
    const normalizedValue = centeredValue / denominator;
    const result = normalizedValue;

    return result;
  });
  const result = normalizedVector;

  return result;
};

const getL2Norm = (vector: readonly number[]) => {
  const sumOfSquares = vector.reduce((total, value) => {
    const result = total + value * value;

    return result;
  }, 0);
  const l2Norm = Math.sqrt(sumOfSquares);
  const result = l2Norm;

  return result;
};

const normalizeVector = (vector: readonly number[]) => {
  const l2Norm = getL2Norm(vector);

  if (l2Norm <= VECTOR_NORM_EPSILON) {
    const zeroVector = vector.map(() => 0);
    const result = zeroVector;

    return result;
  }

  const normalizedVector = vector.map((value) => {
    const normalizedValue = value / l2Norm;
    const result = normalizedValue;

    return result;
  });
  const result = normalizedVector;

  return result;
};

const postprocessNomicEmbeddingVector = (vector: EmbeddingVector) => {
  const layerNormalizedVector = layerNormalizeVector(vector);
  const normalizedVector = normalizeVector(layerNormalizedVector);
  const result = normalizedVector;

  return result;
};
export type PostprocessEmbeddingVectorsProps = {
  readonly model: string;
  readonly vectors: readonly EmbeddingVector[];
};

export const postprocessEmbeddingVectors = (
  props: PostprocessEmbeddingVectorsProps,
) => {
  const { model, vectors } = props;
  const usesNomicBehavior = checkUsesNomicBehavior(model);

  if (usesNomicBehavior === false) {
    const result = vectors;

    return result;
  }

  const postprocessedVectors = vectors.map((vector) => {
    const postprocessedVector = postprocessNomicEmbeddingVector(vector);
    const result = postprocessedVector;

    return result;
  });
  const result = postprocessedVectors;

  return result;
};
