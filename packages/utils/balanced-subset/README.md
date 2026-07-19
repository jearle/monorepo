# balanced-subset

Select deterministic, coverage-balanced subsets from scored candidates.

Use this package when a caller has more eligible candidates than the final
result should keep, and the final subset must preserve target coverage across
caller-defined buckets instead of simply taking the highest scores.

Examples:

- Select final behavior-dataset prompts from an overgenerated pool while
  preserving coverage across length bands, prompt styles, categories, or risk
  types.
- Select an MTG Commander deck from legal candidate cards while preserving
  coverage across primary deck roles such as lands, ramp, removal, card draw,
  protection, synergy, and win conditions.
- Select evaluation samples, review items, or regression tests while preserving
  representation across labels, sources, severities, or feature areas.

## Public helpers

- `allocateBucketTargets({ buckets, targetCount })`
- `checkHasBucketTarget({ bucketId, bucketTargets })`
- `checkIsEligibleCandidate({ bucketTargets, candidate, selectedCandidates, selectedIds })`
- `compareBalancedSubsetCandidates({ candidate1, candidate2, coverageGaps })`
- `createSelectedCounts({ bucketTargets, selectedCandidates })`
- `createBalancedSubsetDecision({ bucketTargets, candidate, normalizedTargetCount, selectedCandidates, selectedIds })`
- `createBalancedSubsetReasonCode({ bucketTargets, candidate, normalizedTargetCount, selectedCandidates, selectedIds })`
- `getBucketTargetCount({ bucketId, bucketTargets })`
- `getSelectedBucketCount({ bucketId, selectedCandidates })`
- `scoreCoverageGaps({ selectedCounts, targets })`
- `selectNextCandidate({ bucketTargets, candidates, selectedCandidates })`
- `selectBalancedSubset({ buckets, candidates, targetCount })`

## Runtime rules

- Candidate IDs, bucket IDs, scores, weights, and hard rejection flags are provided by callers.
- The package does not depend on behavior-dataset row shapes or policy thresholds.
- Bucket target allocation uses weighted largest remainder allocation with bucket ID tie breaking.
- Candidate ranking prioritizes hard rejection, coverage gaps, score, then candidate ID.
- Balanced subset selection returns selected IDs, skipped IDs, per-candidate decisions, and final coverage gaps.
- Each candidate currently belongs to one primary bucket. Callers with multi-role candidates should choose the primary role before calling this package.
