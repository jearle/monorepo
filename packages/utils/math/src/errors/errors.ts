export const EMPTY_VECTOR_ERROR = `vector must contain at least one value`;
export const MISMATCHED_VECTOR_LENGTH_ERROR = `vectors must have the same length`;
export const NON_FINITE_VECTOR_VALUE_ERROR = `vector values must be finite numbers`;
export const ZERO_MAGNITUDE_VECTOR_ERROR = `vector magnitude must be greater than zero`;
export const NON_FINITE_COSINE_SIMILARITY_ERROR = `cosine similarity must be finite`;
export const NON_SQUARE_SIMILARITY_MATRIX_ERROR = `similarity matrix must be square`;
export const NON_FINITE_SIMILARITY_MATRIX_VALUE_ERROR = `similarity matrix values must be finite numbers`;
export const INSUFFICIENT_SIMILARITY_MATRIX_ROWS_ERROR = `similarity matrix must contain at least two rows to compute nearest-neighbor similarities`;
export const NON_FINITE_VALUE_ERROR = `values must be finite numbers`;
export const NON_FINITE_THRESHOLD_ERROR = `threshold must be a finite number`;
export const UNEXPECTED_DISTRIBUTION_SUMMARY_ERROR = `distribution summary could not be created`;

export type CreateEmptyVectorErrorMessageProps = {
  readonly vectorName: string;
};

export const createEmptyVectorErrorMessage = (
  props: CreateEmptyVectorErrorMessageProps,
) => {
  const { vectorName } = props;
  return `${vectorName}: ${EMPTY_VECTOR_ERROR}`;
};

export type CreateMismatchedVectorLengthErrorMessageProps = {
  readonly expectedLength: number;
  readonly receivedLength: number;
  readonly vectorName: string;
};

export const createMismatchedVectorLengthErrorMessage = (
  props: CreateMismatchedVectorLengthErrorMessageProps,
) => {
  const { expectedLength, receivedLength, vectorName } = props;
  const errorDetails = `expected length ${expectedLength}, received ${receivedLength}`;
  return `${vectorName}: ${MISMATCHED_VECTOR_LENGTH_ERROR}, ${errorDetails}`;
};

export type CreateNonFiniteVectorValueErrorMessageProps = {
  readonly valueIndex: number;
  readonly vectorName: string;
};

export const createNonFiniteVectorValueErrorMessage = (
  props: CreateNonFiniteVectorValueErrorMessageProps,
) => {
  const { valueIndex, vectorName } = props;
  return `${vectorName}[${valueIndex}]: ${NON_FINITE_VECTOR_VALUE_ERROR}`;
};

export type CreateZeroMagnitudeVectorErrorMessageProps = {
  readonly vectorName: string;
};

export const createZeroMagnitudeVectorErrorMessage = (
  props: CreateZeroMagnitudeVectorErrorMessageProps,
) => {
  const { vectorName } = props;
  return `${vectorName}: ${ZERO_MAGNITUDE_VECTOR_ERROR}`;
};

export type CreateNonSquareSimilarityMatrixErrorMessageProps = {
  readonly expectedLength: number;
  readonly receivedLength: number;
  readonly rowIndex: number;
};

export const createNonSquareSimilarityMatrixErrorMessage = (
  props: CreateNonSquareSimilarityMatrixErrorMessageProps,
) => {
  const { expectedLength, receivedLength, rowIndex } = props;
  const errorDetails = `row ${rowIndex} expected length ${expectedLength}, received ${receivedLength}`;
  return `${NON_SQUARE_SIMILARITY_MATRIX_ERROR}, ${errorDetails}`;
};

export type CreateNonFiniteSimilarityMatrixValueErrorMessageProps = {
  readonly columnIndex: number;
  readonly rowIndex: number;
};

export const createNonFiniteSimilarityMatrixValueErrorMessage = (
  props: CreateNonFiniteSimilarityMatrixValueErrorMessageProps,
) => {
  const { columnIndex, rowIndex } = props;
  return `similarityMatrix[${rowIndex}][${columnIndex}]: ${NON_FINITE_SIMILARITY_MATRIX_VALUE_ERROR}`;
};

export type CreateNonFiniteValueErrorMessageProps = {
  readonly valueIndex: number;
};

export const createNonFiniteValueErrorMessage = (
  props: CreateNonFiniteValueErrorMessageProps,
) => {
  const { valueIndex } = props;
  return `values[${valueIndex}]: ${NON_FINITE_VALUE_ERROR}`;
};
