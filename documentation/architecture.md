# Architecture

The canonical architecture and coding guidance lives in
[`docs/conventions`](../docs/conventions/README.md). The repository is organized
as Bun workspaces under `packages/<family>/<package>` and exposes package APIs
through `src/index.ts` entrypoints.

Use the `repo` CLI through root scripts for formatting, linting, compilation,
tests, dependency validation, and package export validation.
