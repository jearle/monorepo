import { type BalancedSubsetCandidate } from './types';

export type GetSelectedBucketCountProps = {
  readonly bucketId: string;
  readonly selectedCandidates: readonly BalancedSubsetCandidate[];
};

export const getSelectedBucketCount = (props: GetSelectedBucketCountProps) => {
  const { bucketId, selectedCandidates } = props;
  const matchingCandidates = selectedCandidates.filter((candidate) => {
    return candidate.bucketId === bucketId;
  });
  const result = matchingCandidates.length;

  return result;
};
