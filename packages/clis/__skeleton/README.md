# CLI \_\_skeleton

Copy this folder when creating a new `packages/clis/*` package.

After copying:

1. Rename the folder.
2. Replace `@jearle/cli-__skeleton` and the `__skeleton` bin name in `package.json`.
3. Replace `__skeleton`, `__skeleton CLI package`, and the `COMMAND___SKELETON*` constants in `src/constants/constants.ts`.
4. Rename `src/__skeleton-command`.
5. Rename `src/__skeleton-command/create-__skeleton-command.ts`.
6. Rename `src/__skeleton-command/create-__skeleton-health-command.ts` if the copied CLI keeps a health smoke-test command.
7. Replace exported identifiers such as `create__skeletonCommand`, `__skeletonCommand`, `create__skeletonHealthCommand`, and `__skeletonHealthCommand`.
8. Update imports and exports in `src/app/create-app.ts`, `src/index.ts`, and `src/__skeleton-command/index.ts`.
9. Replace or remove the `health` smoke-test command with domain commands.
10. Add real dependencies to `src/services/create-services.ts`.
11. Run `rg "__skeleton"` from the copied package and replace any remaining scaffold markers.

The command package should keep a grouped `create__skeletonCommand` export for aggregate CLI apps. The standalone copied CLI should flatten that group's child commands at the root, for example:

- `bun run cli health`

Aggregate CLI apps should mount the grouped command directly, for example:

- `monorepo __skeleton health`
