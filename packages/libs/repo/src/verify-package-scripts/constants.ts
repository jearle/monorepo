import { type ForbiddenPackageScriptCommand } from './types';

export const FORBIDDEN_PACKAGE_SCRIPT_COMMANDS: readonly ForbiddenPackageScriptCommand[] =
  [
    {
      label: `tsc`,
      pattern: /(?:^|[&|;()\s])(?:bunx\s+|npx\s+)?tsc(?:\s|$)/u,
    },
    {
      label: `prettier`,
      pattern: /(?:^|[&|;()\s])(?:bunx\s+|npx\s+)?prettier(?:\s|$)/u,
    },
    {
      label: `oxlint`,
      pattern: /(?:^|[&|;()\s])(?:bunx\s+|npx\s+)?oxlint(?:\s|$)/u,
    },
    {
      label: `stylelint`,
      pattern: /(?:^|[&|;()\s])(?:bunx\s+|npx\s+)?stylelint(?:\s|$)/u,
    },
    {
      label: `bun test`,
      pattern: /(?:^|[&|;()\s])bun\s+test(?:\s|$)/u,
    },
  ];

export const IGNORED_PACKAGE_FILE_DIRECTORY_NAMES: ReadonlySet<string> =
  new Set([`.turbo`, `build`, `coverage`, `dist`, `node_modules`]);

export const PACKAGE_SCRIPT_COMPILE = `compile`;
export const PACKAGE_SCRIPT_FORMAT = `format`;
export const PACKAGE_SCRIPT_LINT = `lint`;
export const PACKAGE_SCRIPT_LINT_STYLE = `lint:style`;
export const PACKAGE_SCRIPT_TEST = `test`;
export const PACKAGE_SCRIPT_VERIFY = `verify`;

export const PACKAGE_SCRIPT_COMPILE_COMMAND = `bun run repo package compile`;
export const PACKAGE_SCRIPT_FORMAT_COMMAND = `bun run repo package format`;
export const PACKAGE_SCRIPT_LINT_COMMAND = `bun run repo package lint`;
export const PACKAGE_SCRIPT_LINT_STYLE_COMMAND = `bun run repo package lint-style`;
export const PACKAGE_SCRIPT_TEST_COMMAND = `bun run repo package test`;
export const PACKAGE_SCRIPT_VERIFY_COMMAND = `bun run repo package verify`;

export const STYLE_FILE_EXTENSIONS: ReadonlySet<string> = new Set([
  `.css`,
  `.scss`,
]);
