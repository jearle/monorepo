# CLI Utils

Manual inspection commands for Monorepo utility packages.

## Commands

- `utils template render --template-file <path> --data-file <path>`
- `utils template render-file --root <path> --template <relative-path> --data-file <path>`
- `utils template analyze --template-file <path>`
- `utils json parse --file <path>`
- `utils json stringify --file <path>`
- `utils json stable-stringify --file <path>`
- `utils csv parse --file <path> --header`
- `utils csv export --file <path>`
- `utils env validate --schema node-env --file <path>`
- `utils http request <url> --method get`

## Development

- `bun run compile`
- `bun run lint`
- `bun test`
- `bun run verify`
