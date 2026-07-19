# App \_\_skeleton CLI

Copy this folder when creating a new CLI app under `packages/apps/*`.

After copying:

1. Rename the folder.
2. Replace `@jearle/app-__skeleton` and the `__skeleton` bin name in `package.json`.
3. Replace `__skeleton`, `__skeleton CLI app`, and related constants.
4. Replace logger name `app-__skeleton`.
5. Replace or remove the `health` smoke-test command with app commands.
6. Run `rg "__skeleton"` from the copied package and replace any remaining scaffold markers.
