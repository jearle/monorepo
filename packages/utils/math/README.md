# math

Domain-neutral numeric and vector helpers for shared MONOREPO packages.

## Public helpers

- `round(value, options?)`
- `getCosineSimilarity({ vector1, vector2 })`
- `createCosineSimilarityMatrix({ vectors })`
- `getNearestNeighborSimilarities({ similarityMatrix })`
- `summarizeDistribution({ values })`
- `getPercentBelowThreshold({ values, threshold })`
- `createFrequencyTable({ values })`
- `getTopFrequencies({ values, limit })`
- `getTopCumulativeShare({ values, limit })`
- `getNormalizedEntropy({ values })`
- `summarizeFrequencyDistribution({ values, topLimit })`

## Runtime rules

- Similarity and distribution helpers never throw. They return structured results with `error: Error | null`.
- `getCosineSimilarity()` returns mathematical cosine similarity and does not clamp values.
- `createCosineSimilarityMatrix({ vectors: [] })` returns an empty matrix.
- `getNearestNeighborSimilarities({ similarityMatrix: [] })` returns an empty collection.
- `getNearestNeighborSimilarities({ similarityMatrix: [[1]] })` returns an `Error` because no distinct neighbor exists.
- `summarizeDistribution({ values: [] })` returns zeros for `min`, `median`, `p95`, and `max`.
- `getPercentBelowThreshold({ values: [] })` returns `0`.
- `getPercentBelowThreshold()` uses strict `< threshold` comparison.
- Frequency distribution helpers expect pre-tokenized string values.
- Frequency table output is ordered by count descending, then value ascending.
- Frequency share, cumulative share, and normalized entropy round to six decimal places by default.
- API callers that populate the current `DatasetQualityReportSchema` remain responsible for reconciling any raw cosine output with that schema's `0..1` wire constraints.

```typescript
const { error, similarity } = getCosineSimilarity({
  vector1: [1, 0],
  vector2: [0, 1],
});

if (error !== null) {
  console.error(error.message);
}
```

## Composition boundary

`@jearle/util-math` owns only domain-neutral numeric helpers. It does not own
dataset thresholds, `qualityStatus`, flagged item selection, duplicate policy,
or `quality-report` output shaping. API code composes these helpers with the
existing `texts -> vectors` seams from `@jearle/util-llm` and
`@jearle/util-embeddings`.
