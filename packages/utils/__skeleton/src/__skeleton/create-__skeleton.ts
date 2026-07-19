import { type Create__skeletonResult } from './types';

export type Create__skeletonProps = {
  readonly value: string;
};

export const create__skeleton = (props: Create__skeletonProps) => {
  const { value } = props;
  const __skeletonResult: Create__skeletonResult = {
    value,
  };
  const result = __skeletonResult;

  return result;
};
