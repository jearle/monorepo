# Conventions

These repository-local conventions override broader TypeScript defaults when they are more specific.

Read the smallest relevant file before changing code:

- `module-structure.md`: Package layout, feature folders, support folders, exports, tests, and examples.
- `typescript.md`: Function shape, one-line-one-operation, immutability, status values, error handling, and documentation.
- `typescript-type-naming.md`: Type helper names, including props, context, options, and result types.
- `domain-modeling.md`: Package-local domain names, generation vocabulary, bucket terms, and entity ID/key ownership.
- `dependency-context.md`: How to pass shared dependencies through app, command, service, and helper layers.
- `service-wiring.md`: What belongs in service factory files and how to avoid scaffold-only services.
- `validation.md`: Zod schemas, boundary validation, trusted internal values, and environment variables.
- `testing.md`: Public API tests, test scope, and type tests.
- `frontend.md`: Frontend structure, Jotai state, UI examples, and frontend test expectations.
- `tooling.md`: Dependency graph checks, package export checks, and false-positive triage.
- `pr-review-readiness.md`: Pre-review rules and their enforcement follow-ups.

Use `~/.ai/ts-coding-standards.md` as the broader personal baseline after applying these repository conventions.
