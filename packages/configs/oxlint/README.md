# Monorepo Oxlint Config

This package exports the shared Oxlint config and the local
`monorepo-conventions` JS plugin.

## Scripts

- `bun run lint` runs Oxlint for this package.
- `bun run test` runs the custom rule test suite.

The repository root `bun run verify` command also runs this package's rule
tests through this package's `test` script.

## Typed Linting

The shared config enables Oxlint type-aware linting for TypeScript and TSX
files. Type-aware rules cover unsafe value usage, unnecessary type assertions,
floating promises, and promise misuse.

Use root `bun run lint` for the full repository lint pass. Oxlint runs the local
`monorepo-conventions` plugin through JS plugin support.

Type-aware linting is slower because TypeScript must build project information
for each package. Keep generated files and package root config files out of the
typed pass unless their nearest `tsconfig.json` includes them intentionally.

Test files keep type-aware promise and assertion checks enabled, but relax unsafe
value-access rules so response-body and fixture assertions can stay lightweight.

## Custom Rules

Custom convention rules live in `rules/` and are registered from
`monorepo-conventions-plugin.js`.

When adding or changing a rule:

1. Add the rule implementation under `rules/`.
2. Register the rule in `monorepo-conventions-plugin.js`.
3. Enable the rule in `.oxlintrc.json` when it should apply across the repo.
4. Add valid, invalid, and autofix cases in a focused `rules/*.test.js` file.
5. Run `bun run test` from this package.

Keep fixtures small and deterministic. Prefer syntax-only fixtures unless the
rule needs TypeScript reference tracking.

The test suite writes deterministic fixture files and runs Oxlint against each
case so custom rule behavior is verified through the same engine used by the
repository lint scripts.
