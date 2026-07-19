# Module Structure

Use shallow package structure and export public APIs through `index.ts`.

## Package Layout

- Public package entrypoints are exposed through `index.ts` only.
- Implementation files use named inline exports. Do not use default exports.
- Implementation files expose one public runtime export.
- Implementation filenames match their public runtime export names in kebab-case.
- Public export names should use package-local domain names from
  `domain-modeling.md` instead of repeating the package/domain prefix.
- Predicate and type guard files include the `check` prefix, for example
  `check-is-csv-export-input.ts`.
- `index.ts` files only re-export public APIs.
- Do not import from internal files of another package or module.
- Keep `src/` shallow: one `index.ts`, first-depth feature folders, and package-global support folders only.
- In app packages, reserve `src/app/` for the top-level app shell. App features live in flat sibling folders at `src/<feature>/`.
- CLI bin entrypoints at `src/main.ts` start with `#!/usr/bin/env bun`.

## Scaffolded Packages

- Packages created from repo skeletons preserve the generated baseline structure
  unless the active issue, plan, or explicit user direction scopes a generated
  surface out.
- Skeleton packages and package-generation templates model the current
  conventions for exported functions, service factories, type placement, and
  package public entrypoints.
- Do not treat unused generated support surfaces as scaffold-only cleanup by
  default. If a generated surface is intentionally removed, document the reason
  in the PR summary.

## Feature Folders

Group by feature or domain, not by technical layer. Feature folders stay flat, even when they contain many files.

```text
src/index.ts
src/types/types.ts
src/errors/errors.ts
src/dataset-quality/
src/dataset-quality/index.ts
src/dataset-quality/create-report.ts
src/dataset-quality/create-report.test.ts
src/dataset-quality/types.ts
```

Avoid deep nesting and loose implementation files at `src/` root.

```text
# Bad
src/features/users/controllers/update.ts
src/update-user.ts

# Good
src/update-user/update-user.ts
src/update-user/update-user.test.ts
src/update-user/index.ts
```

## CLI Command Naming

CLI command folder names, filenames, and public symbols use these prefix rules:

- Root command composers keep the package-domain prefix so app-level
  composition stays specific. For example, a behavior-datasets root command
  composer belongs in
  `src/behavior-datasets-command/create-behavior-datasets-command.ts` and
  exports `createBehaviorDatasetsCommand`.
- Promoted command groups drop the package-domain prefix. A promoted command
  group is a command subgroup housed in its own direct child
  `src/<group>-command/` folder beside the root command folder. The group
  composer and leaf commands inside that folder use group-local names. For
  example, a promoted prompt subgroup uses
  `src/prompt-command/create-prompt-command.ts` and exports
  `createPromptCommand`; its `run` leaf uses
  `src/prompt-command/create-prompt-run-command.ts` and exports
  `createPromptRunCommand`.
- Root-mounted leaf commands (commands that stay in the root command folder
  rather than being promoted) keep the package-domain prefix in their filenames
  and public symbols. For example, a root-mounted behavior-datasets health
  command uses
  `src/behavior-datasets-command/create-behavior-datasets-health-command.ts`
  and exports `createBehaviorDatasetsHealthCommand`.

The asymmetry between promoted command groups and root-mounted leaves is
intentional. Root composers and root-mounted leaves stay app-facing and
domain-specific, while promoted command groups use command-group-local names.

## Support Folders

- Package-wide public types live in `src/types/types.ts`.
- Feature-scoped public context, options, result, model, and shared types live in `src/<feature>/types.ts`.
- Factory-derived `...Service` types stay beside their service factory, like
  other `ReturnType<typeof ...>` aliases, so the factory return object remains
  the single source of truth.
- Public props types live beside the public function or component that owns them.
- Public domain scalar schemas and derived scalar types live in the feature
  files that define the public contract and are re-exported through the feature
  `index.ts`.
- Package-local schemas in non-schema packages live in
  `src/<feature>/<x>-schema.ts`, using a singular `-schema.ts` suffix so the
  schema file is ready to promote into `packages/schemas` when the contract
  becomes shared.
- Environment schemas keep the established `src/env/env-schema.ts` name.
- Package-wide constants live in `src/constants/constants.ts` and contain value constants only.
- Feature-scoped constants live in `src/<feature>/constants.ts` and contain value constants only.
- Feature constants modules that cross the file-size review threshold may be
  split into focused `src/<feature>/<topic>-constants.ts` files when each split
  keeps a cohesive group of value constants within the same `src/<feature>/`
  directory.
- Reusable error strings live in `src/errors/errors.ts` or
  `src/<feature>/errors.ts`, together with error-message builders and
  error/result helpers.
- Error string constants are not declared inline in implementation files.
- Error maps and error object/result builders live in the nearest error
  module, not in the workflow implementation file.
- Reused model names and external identifiers are named constants.
- Public function props types are exported and placed immediately above their
  owning public function.

## File Size

Source files, tests, and long functions over 200 lines require explicit review.
Prefer splitting long files by existing feature module roles: schema files,
`types.ts`, `errors.ts`, `constants.ts`, public runtime implementation files,
tests grouped by contract area, and small private helper files. Keep a file over
200 lines only when the code is cohesive and splitting would make the feature
harder to read or maintain.

## Schema Packages

- Schema packages own Zod schemas, schema constants, derived types, and schema
  refinement helpers.
- Schema packages do not own behavior-heavy extraction, normalization,
  transformation, parsing, scoring, packaging, or service logic.
- If schema-shaped data needs reusable behavior, put the behavior in the
  service or utility package that owns that workflow and import the schema
  contract from `packages/schemas/`.
- Schema refinement helpers may inspect values only to produce schema issues
  for the schema that calls them.
- Public schema-package runtime exports named with a workflow verb prefix
  (`build*`, `create*`, `destroy*`, `extract*`, `normalize*`, `package*`,
  `parse*`, `read*`, `score*`, `transform*`, `update*`, or `validate*`) are
  treated as behavior, not schema contracts. This is the same canonical workflow
  verb set used by the service workflow rules.

## Error Modules

- Reusable human-facing error strings live in `src/errors/errors.ts` or
  `src/<feature>/errors.ts`.
- Feature-specific error modules live beside the feature code they support.
- Error modules own error codes, reusable error messages, error-message
  builders, and error/result helper functions.
- Error-message builders, error/result helpers, and error-message-by-code maps
  belong in the nearest package or feature error module whether they are
  exported or private, including one-off helpers.
- Implementation files may pass through an existing error message or compose a
  row/request-specific detail from error-module constants, but they do not
  inline reusable error strings.
- Schema files may define Zod refinement issue text beside the schema only when
  the text is local to that schema refinement.

## Tests And Examples

- Public-facing feature implementations have a co-located test file that imports from `.`.
- Tests use real local/package dependencies.
- UI components include a co-located `Example.tsx`.
- Non-component files and folders use kebab-case.
- React component files may use `CapitalCase.tsx`.
