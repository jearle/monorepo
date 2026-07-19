# PR Review Readiness

Pre-review rules. Check the diff against each before requesting review.
The rules are monorepo-wide; the linked convention docs own deeper details.

1. **Match convention scope to enforcement.** Global convention docs and rules
   must stay package-agnostic. Package-specific exceptions live with the owning
   package. When a repeated complaint becomes a convention, land the doc text,
   deterministic oxlint rule or documented `rg` fallback gate, tests, and config
   together. See `module-structure.md` and `tooling.md`.

2. **Keep files near the owning feature.** Constants, schemas, error helpers,
   props types, private helper types, tests, and examples live beside the
   feature or function they support. Move shared concerns only when another
   package or feature has a real reuse path. See `module-structure.md`.

3. **Split oversized files before review.** The 200-line review threshold from
   `module-structure.md` applies to source files, tests, and long functions.
   Split large refinement, validation, and test files by public contract or
   feature role unless keeping them together is explicitly more readable.

4. **Promote generic helpers to shared packages.** Domain-free helpers such as
   result shapes, array access, process spawning, terminal color, casing, and
   reusable error helpers belong in the `packages/utils/*` package that owns the
   concern. Before keeping a helper local, confirm it is genuinely private.

5. **Make TypeScript flow inspectable.** Prefer named intermediate values,
   named predicate-result constants, early returns, ordinary `try/catch`, and
   `result` variables for structured returns. Do not hide meaningful operations
   inside nested calls, nested ternaries, inline IIFEs, or one-off casts. See
   `typescript.md`.

6. **Keep helper and type naming strict.** Object-shaped function inputs use
   `props`; function-owned input types use `CreateThingProps`; shared contexts
   use `ThingContext`; optional modifiers use `ThingOptions`; exported
   structured results use `ThingResult`; predicate functions use
   `checkIs`, `checkHas`, `checkCan`, or `checkShould`. See `typescript.md`.

7. **Export every public contract shape.** If a public schema, type, props
   object, result object, or function signature exposes a local type, export
   that local type too. Avoid nested object type literals, prefer
   `readonly T[]`, export public scalar schemas and derived types, and use
   current Zod APIs. See `typescript.md` and `validation.md`.

8. **Hoist static values into named constants.** Reusable literals, error
   strings, default objects, status values, curated lexical lists, and external
   identifiers belong in constants or error modules with `as const` where useful.
   Do not recreate a default object or repeated literal on every call.

9. **Test public contracts, not internals.** Tests import feature or package
   entrypoints, use real local and package dependencies, avoid internal mocks,
   and avoid overspecified implementation assertions. Broaden tests only when a
   change touches shared contracts or user-facing workflows. See `testing.md`.

10. **Verify boundaries and dependencies.** Use package dependencies instead of
    reaching outside package roots. Inject loggers and output dependencies in
    libraries, use `createEnv()`, validate external input at boundaries, and keep
    package scripts on the Monorepo repo CLI path. See `dependency-context.md`,
    `validation.md`, and `tooling.md`.

11. **Settle domain names across the whole surface.** Avoid overgeneric public
    exports and redundant package prefixes. Apply entity, key, slug, and ID
    semantics consistently across schemas, fixtures, tests, services, docs, and
    rules. See `domain-modeling.md`.

12. **Close the review loop explicitly.** Resolve every review comment: fix it
    or answer with a rationale before re-requesting review. Recheck stacked
    feedback after restacks.

## Fallback Gates

Until each rule below has deterministic oxlint coverage, record the relevant
fallback gate in the PR verification notes. A fallback gate passes when it
returns no matches or only documented, reviewed exceptions.

- Oxlint rules stay errors:

  ```sh
  rg -n '"warn"|\[\s*"warn"' packages/configs/oxlint
  ```

- Inline oxlint disables are reviewed exceptions:

  ```sh
  rg -n 'oxlint-disable' --glob '*.{js,ts,tsx}'
  ```

- Library, utility, and service packages do not write directly to the console:

  ```sh
  rg -n '\bconsole\.' packages/libs packages/utils packages/services --glob '*.{ts,tsx}'
  ```

- Changed TypeScript and TSX files over 200 lines have explicit review
  justification:

  ```sh
  git diff --name-only --diff-filter=ACM origin/main...HEAD -- '*.ts' '*.tsx' | xargs wc -l
  ```

- Changed TypeScript and TSX files use object property shorthand where possible:

  ```sh
  git diff --name-only --diff-filter=ACM origin/main...HEAD -- '*.ts' '*.tsx' | while read -r file; do rg --pcre2 -n '\b([A-Za-z_$][A-Za-z0-9_$]*)\s*:\s*\1\b' "$file"; done
  ```

- Object-literal parameter defaults are reviewed for per-call allocation:

  ```sh
  git diff --name-only --diff-filter=ACM origin/main...HEAD -- '*.ts' '*.tsx' | while read -r file; do rg -n '\([^)]*=\s*(\{|\[)' "$file"; done
  ```

- Public schema exports avoid overgeneric names:

  ```sh
  git diff --name-only --diff-filter=ACM origin/main...HEAD -- 'packages/schemas/**/*.ts' | while read -r file; do rg -n 'export\s+(const|type)\s+(Key|Description|Metadata|Config)Schema\b' "$file"; done
  ```

- Schema refinement conversion PRs run the technical review gates below for
  each affected schema feature folder and include the output in the PR
  verification notes.

  Issue-producing helper files keep issue construction separate from
  `ctx.addIssue` emission. Expected output: empty.

  ```sh
  SCHEMA_REFINEMENT_PATH=packages/schemas/<package-name>/src/<feature-folder>
  rg -n "ctx\.addIssue" "$SCHEMA_REFINEMENT_PATH" --glob '!*.test.ts' --glob 'get-*-issues.ts'
  ```

  Refinement boundary files that call `ctx.addIssue` are covered by an explicit
  PR-local allowlist in the PR verification notes. Expected output: every match
  is in the allowlist; issue-producing helper files matching `get-*-issues.ts`
  produce empty output in the previous gate.

  ```sh
  SCHEMA_REFINEMENT_PATH=packages/schemas/<package-name>/src/<feature-folder>
  rg -n "ctx\.addIssue" "$SCHEMA_REFINEMENT_PATH" --glob '!*.test.ts'
  ```

  Issue-producing helpers use immutable collection/object construction.
  Expected output: empty, or documented reviewed exceptions.

  ```sh
  SCHEMA_REFINEMENT_PATH=packages/schemas/<package-name>/src/<feature-folder>
  rg -n -e "\.set\(|\.add\(|\.delete\(|\.clear\(|Object\.assign\(|\|\|=|&&=|\?\?=" "$SCHEMA_REFINEMENT_PATH" --glob '!*.test.ts'
  ```

  `get-*-issues.ts` helper files return the private readonly
  `RefinementIssues` issue-array type. Expected output: empty; every helper file
  returns `RefinementIssues`.

  ```sh
  SCHEMA_REFINEMENT_PATH=packages/schemas/<package-name>/src/<feature-folder>
  rg --files-without-match "\): RefinementIssues =>" "$SCHEMA_REFINEMENT_PATH" --glob 'get-*-issues.ts'
  ```
