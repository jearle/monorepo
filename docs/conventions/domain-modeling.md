# Domain Modeling

Use package context to keep domain names precise and short.

## Package-Local Names

Inside a domain package, do not repeat the package or domain name in public
schemas, types, functions, files, or service exports when local context already
identifies the domain.

Prefer simple names:

- `GenerationConfigSchema`, not `BehaviorDatasetGenerationConfigSchema`.
- `CandidateMetadata`, not `BehaviorDatasetCandidateMetadata`.
- `renderScenarioStyleInstructions`, not
  `renderBehaviorDatasetScenarioStyleInstructions`.

Redundant prefixes are allowed only when they resolve a real collision that
cannot be handled by import aliasing or local context.

Service identity exports are the behavior-datasets exception. Keep the factory,
service type, context, and error type externally descriptive:
`createBehaviorDatasetsService`, `BehaviorDatasetsService`,
`BehaviorDatasetsServiceContext`, and `BehaviorDatasetsServiceError`.

## Generation Vocabulary

Reserve `request`, `requests`, and `*Request` for HTTP, provider, or other
external I/O boundaries. Generation-pipeline data is not a request until it
crosses such a boundary.

Use these names in behavior-dataset generation code:

- `ExampleSpec` for the input item that generates one row.
- `templateData` for values used to fill a template.
- `renderedPrompt` for the filled prompt sent to an LLM.
- `providerText` for the exact provider response and `generatedText` for the
  normalized content of the locally wrapped generated singleton, regardless of
  its canonical message role. Normalization trims the provider response and,
  when the entire trimmed response is one closed Markdown fenced code block,
  removes only that outer fence and trims the inner content. Backtick and tilde
  fences qualify regardless of their info string. Unclosed fences, surrounding
  prose, and multiple sibling fenced blocks remain trimmed but are otherwise
  unchanged and are not unwrapped. Normalization does not depend on the
  selected buckets. Local metrics, validators, canonical messages, and final
  JSONL use `generatedText`; `providerText` remains exact provider provenance
  only. Use `record.text` where the dataset-labeling contract requires it.
- `Example` for the final generated payload.
- `Candidate` only for transient alternatives that can still be rejected or
  selected.
- `specs` for batch input collections.
- `examples` for accepted final public output collections.
- `runKey` for a non-entity generation-run reference. Use `runId` only as a
  reference to a generation-run entity's UUID `id`.

## Provider Prompt Ownership

Model-facing generation directives belong in source-aware config values or
template assets, not TypeScript strings. This includes initial generation,
retry, long-form outline, and long-form partial instructions. Production code
owns neutral structured facts, stable identifiers, counts, selection, and
routing, validation, and rendering; authored templates own the language
presented to the model.

Preserve the source origin of every authored prompt surface. Config-owned
bucket instructions and retry instructions resolve imports from the config
source origin. Prompt-owned templates, including long-form outline and partial
assets, resolve imports from the effective prompt source origin. These roots do
not fall back to or leak into each other, and source discovery must preserve the
injected template client's filters, globals, strictness, and limits.

Generation config has one required root `promptSections` array. Each section
contains only a unique kebab-case diagnostic `name`, one Liquid `heading`, and
an ordered nonempty array of full Liquid `instructions`. Do not add
compatibility aliases, defaults, `value`, `type`, `kind`, `role`, `retryOnly`,
metadata, parallel section arrays, recursive section templates, or
`generation.retryGuidance`.
Section imports resolve from the directory containing the config; nested
imports resolve from the importer. Explicit `../` cross-band imports are valid.
Config-owned resolution never falls back to or leaks into the prompt-owned
root, and prompt-owned resolution never falls back to or leaks into the
config-owned root.

Render all instructions for one section exactly once against the same canonical
pre-section scope. Discard whitespace-only results. If none remain, omit the
section without rendering its heading. Otherwise, render the heading exactly
once and fail preflight if the result is blank. Sections cannot observe earlier
rendered sections. Bucket instructions, routed retry instructions, section
headings, and section instructions share this scope. Keep authored sections at
`config.promptSections`; expose resolved sections only as the final prompt's
root `promptSections`, with each entry containing exactly the unchanged `name`
and rendered `heading` and `instructions` bytes. Reserve `promptSections`
against named-source shadowing.

Generic prompt composition may add only tested neutral newline separators. It
must preserve retained bytes, duplicates, and order, and must not add headings,
bullets, punctuation, dataset prose, bucket names, retry logic, or capture
blocks. General quality-retry guidance belongs in config-owned sections, which
supersedes only #327's assignment of that prose to the final prompt template.
The closed historical issue remains unchanged. Bucket-specific retry policy
remains in the applicable bucket config.

Errors, diagnostics, and audit summaries that are never sent to a model may
remain code-owned. The provider-preflight health probe is the sole operational
exception for model-facing text because its fixed prompt verifies transport
availability rather than dataset generation behavior.

## Buckets

Use `bucketNames` on a spec when the value means the buckets requested for that
generation item. Spec context already makes the value requested-for-generation,
so the extra `requested` qualifier is redundant there.

When a spec becomes metadata, report, scoring, or selection data, that same
value becomes `requestedBucketNames` if the surface also contains observed,
assigned, or selected buckets.

Use explicit names on metadata, reports, scoring, and selection surfaces when
requested, observed, assigned, or selected bucket concepts appear together:

- `requestedBucketNames`
- `observedBucketNames`
- `assignedBucketNames`
- `selectedBucketNames`

Use `bucketTargets` for configured bucket targets. Do not use
`requestedBuckets` for target config.

## Entities and Keys

Durable item and container schemas use entity bases from `@jearle/schema-entity`
only when the value is semantically an entity.

Use `EntitySchema` only for persisted entities with `id`, timestamps, `name`,
and `metadata`.

Use `EntityBaseSchema` for create/config-like durable item definitions that
need `name` and `metadata` but do not own persistence timestamps.

Do not add `EntityBaseSchema` to a config-like schema that does not already
require both `name` and `metadata`. Adding those fields is a contract change.

Do not treat loose string lookup values as entity IDs. If a value is a stable
domain key but not an entity UUID, name it `key`, `slug`, or `name`, not `id`.
Use `id` for an entity's own UUID and `*Id` only for references to entity IDs.

Adding required entity fields or changing loose strings to UUIDs is a contract
change. Verify producers, fixtures, and validation-error shapes in the same
phase that makes the change.

Transient operation specs do not extend `EntitySchema` or `EntityBaseSchema`
unless they are stored or listed entities. If a pipeline preallocates loose
output identifiers, use a domain key such as `exampleKey`; use `exampleId` only
for a generated example entity UUID.
