import { noDuplicateCaptureCliHelpersRule } from './no-duplicate-capture-cli-helpers.js';
import { noInlineAnsiEscapesRule } from './no-inline-ansi-escapes.js';
import { noProcessExitCodeAssignmentRule } from './no-process-exit-code-assignment.js';
import { preferDirectoryIndexSourceImportsRule } from './prefer-directory-index-source-imports.js';
import { preferExtensionlessRelativeSourceImportsRule } from './prefer-extensionless-relative-source-imports.js';
import { requireHelperTypePlacementRule } from './require-helper-type-placement.js';
import { createOxlintTestHarness } from './create-oxlint-test-harness.js';

const oxlintTestHarness = createOxlintTestHarness();

oxlintTestHarness.run(
  'monorepo-conventions/prefer-directory-index-source-imports',
  preferDirectoryIndexSourceImportsRule,
  {
    valid: [
      {
        code: "import { createThing } from './create-thing';",
      },
      {
        code: "import { createThing } from '../thing';",
      },
      {
        code: "import image from './media/index.png';",
      },
      {
        code: "import { createThing } from '@jearle/util-thing/index';",
      },
    ],
    invalid: [
      {
        code: "import { createThing } from './index';",
        errors: [{ messageId: 'preferDirectoryIndexSourceImport' }],
        output: "import { createThing } from '.';",
      },
      {
        code: "import { createThing } from '../thing/index';",
        errors: [{ messageId: 'preferDirectoryIndexSourceImport' }],
        output: "import { createThing } from '../thing';",
      },
      {
        code: "export { createThing } from '../thing/index.ts';",
        errors: [{ messageId: 'preferDirectoryIndexSourceImport' }],
        output: "export { createThing } from '../thing';",
      },
      {
        code: "const thing = await import('../thing/index.js');",
        errors: [{ messageId: 'preferDirectoryIndexSourceImport' }],
        output: "const thing = await import('../thing');",
      },
      {
        code: "type Thing = import('../thing/index.ts');",
        errors: [{ messageId: 'preferDirectoryIndexSourceImport' }],
        output: "type Thing = import('../thing');",
      },
    ],
  },
);

oxlintTestHarness.run(
  'monorepo-conventions/prefer-extensionless-relative-source-imports',
  preferExtensionlessRelativeSourceImportsRule,
  {
    valid: [
      {
        code: "import { createThing } from './create-thing';",
      },
      {
        code: "import image from './image.png';",
      },
      {
        code: "import { createThing } from '@jearle/util-thing';",
      },
    ],
    invalid: [
      {
        code: "import { createThing } from './create-thing.ts';",
        errors: [{ messageId: 'preferExtensionlessRelativeSourceImport' }],
        output: "import { createThing } from './create-thing';",
      },
      {
        code: "export { createThing } from './create-thing.tsx';",
        errors: [{ messageId: 'preferExtensionlessRelativeSourceImport' }],
        output: "export { createThing } from './create-thing';",
      },
      {
        code: "const thing = await import('./create-thing.js');",
        errors: [{ messageId: 'preferExtensionlessRelativeSourceImport' }],
        output: "const thing = await import('./create-thing');",
      },
      {
        code: "type Thing = import('./create-thing.ts');",
        errors: [{ messageId: 'preferExtensionlessRelativeSourceImport' }],
        output: "type Thing = import('./create-thing');",
      },
    ],
  },
);

oxlintTestHarness.run(
  'monorepo-conventions/no-process-exit-code-assignment',
  noProcessExitCodeAssignmentRule,
  {
    valid: [
      {
        code: 'setCLIFailureExitCode();',
        filename: '/repo/packages/clis/repo/src/verify/create-command.ts',
      },
      {
        code: 'process.exitCode = 1;',
        filename:
          '/repo/packages/utils/cli/src/command-result/set-cli-failure-exit-code.ts',
      },
    ],
    invalid: [
      {
        code: 'process.exitCode = 1;',
        errors: [{ messageId: 'noProcessExitCodeAssignment' }],
        filename: '/repo/packages/clis/repo/src/verify/create-command.ts',
      },
      {
        code: 'process[`exitCode`] = 1;',
        errors: [{ messageId: 'noProcessExitCodeAssignment' }],
        filename: '/repo/packages/clis/repo/src/verify/create-command.ts',
      },
    ],
  },
);

oxlintTestHarness.run(
  'monorepo-conventions/no-inline-ansi-escapes',
  noInlineAnsiEscapesRule,
  {
    valid: [
      {
        code: 'const red = ansis.red;',
        filename: '/repo/packages/libs/repo/src/output/output.ts',
      },
      {
        code: 'const red = `\\u001b[31m`;',
        filename: '/repo/packages/utils/terminal/src/colors/colors.ts',
      },
    ],
    invalid: [
      {
        code: 'const red = `\\u001b[31m`;',
        errors: [{ messageId: 'noInlineAnsiEscape' }],
        filename: '/repo/packages/libs/repo/src/output/output.ts',
      },
      {
        code: 'const red = "\\x1b[31m";',
        errors: [{ messageId: 'noInlineAnsiEscape' }],
        filename: '/repo/packages/libs/repo/src/output/output.ts',
      },
    ],
  },
);

oxlintTestHarness.run(
  'monorepo-conventions/no-duplicate-capture-cli-helpers',
  noDuplicateCaptureCliHelpersRule,
  {
    valid: [
      {
        code: "import { captureCLI } from '@jearle/util-cli';",
        filename: '/repo/packages/clis/repo/src/app/create-app.test.ts',
      },
      {
        code: 'const captureCLI = async () => null;',
        filename: '/repo/packages/utils/cli/src/test/capture-cli.ts',
      },
    ],
    invalid: [
      {
        code: 'const captureCLI = async () => null;',
        errors: [{ messageId: 'noDuplicateCaptureCliHelper' }],
        filename: '/repo/packages/clis/repo/src/app/create-app.test.ts',
      },
      {
        code: 'async function captureCLI() { return null; }',
        errors: [{ messageId: 'noDuplicateCaptureCliHelper' }],
        filename: '/repo/packages/clis/repo/src/app/create-app.test.ts',
      },
    ],
  },
);

oxlintTestHarness.run(
  'monorepo-conventions/require-helper-type-placement',
  requireHelperTypePlacementRule,
  {
    valid: [
      {
        code: 'export type SharedContext = { readonly value: string };',
        filename: '/repo/packages/utils/fixture/src/widget/types.ts',
      },
      {
        code: 'export type CompileProps = { readonly cwd: string };',
        filename: '/repo/packages/utils/fixture/src/widget/compile.ts',
      },
      {
        code: 'export type CompileProps = { readonly cwd: string }; export const compile = (props: CompileProps) => props;',
        filename: '/repo/packages/utils/fixture/src/widget/compile.ts',
      },
      {
        code: 'export type CompileOptions = { readonly cwd: string };',
        filename: '/repo/packages/utils/fixture/src/widget/types.ts',
      },
      {
        code: 'export type CompileResult = { readonly exitCode: number };',
        filename: '/repo/packages/utils/fixture/src/widget/types.ts',
      },
      {
        code: 'type ParsedCompileResult = { readonly value: string };',
        filename: '/repo/packages/utils/fixture/src/widget/compile.ts',
      },
      {
        code: 'export type CompileResult = ReturnType<typeof compile>;',
        filename: '/repo/packages/utils/fixture/src/widget/compile.ts',
      },
      {
        code: 'type CompileResult = ReturnType<typeof createCompileResult>; export const compile = (): CompileResult => createCompileResult();',
        filename: '/repo/packages/utils/fixture/src/widget/compile.ts',
      },
      {
        code: 'type CompileResult = { readonly exitCode: number }; const compile = (): CompileResult => ({ exitCode: 0 });',
        filename: '/repo/packages/utils/fixture/src/widget/compile.ts',
      },
    ],
    invalid: [
      {
        code: 'export type CompileProps = { readonly cwd: string };',
        errors: [{ messageId: 'requirePropsColocation' }],
        files: {
          '/repo/packages/utils/fixture/src/widget/compile.ts':
            'export const compile = () => null;',
        },
        filename: '/repo/packages/utils/fixture/src/widget/types.ts',
      },
      {
        code: 'export type CompileProps = { readonly cwd: string }; const normalize = () => null; export const compile = (props: CompileProps) => props;',
        errors: [{ messageId: 'requirePropsAdjacency' }],
        filename: '/repo/packages/utils/fixture/src/widget/compile.ts',
      },
      {
        code: 'export type CompileProps = { readonly cwd: string }; export const normalize = () => null; export const compile = (props: CompileProps) => props;',
        errors: [{ messageId: 'requirePropsAdjacency' }],
        filename: '/repo/packages/utils/fixture/src/widget/compile.ts',
      },
      {
        code: 'export type CompileOptions = { readonly cwd: string };',
        errors: [{ messageId: 'requireSharedTypeFile' }],
        filename: '/repo/packages/utils/fixture/src/widget/compile.ts',
      },
      {
        code: 'export type CompileResult = { readonly exitCode: number };',
        errors: [{ messageId: 'requireSharedTypeFile' }],
        filename: '/repo/packages/utils/fixture/src/widget/compile.ts',
      },
      {
        code: 'export type CompileContext = { readonly cwd: string };',
        errors: [{ messageId: 'requireSharedTypeFile' }],
        filename: '/repo/packages/utils/fixture/src/widget/compile.ts',
      },
      {
        code: 'type CompileProps = { readonly cwd: string }; export const compile = (props: CompileProps) => props;',
        errors: [{ messageId: 'requirePublicPropsExport' }],
        filename: '/repo/packages/utils/fixture/src/widget/compile.ts',
      },
      {
        code: 'type CompileOptions = { readonly cwd: string }; export const compile = (options: CompileOptions) => options;',
        errors: [{ messageId: 'requireSharedTypeFile' }],
        filename: '/repo/packages/utils/fixture/src/widget/compile.ts',
      },
      {
        code: 'type CompileContext = { readonly cwd: string }; export const compile = (ctx: CompileContext) => ctx;',
        errors: [{ messageId: 'requireSharedTypeFile' }],
        filename: '/repo/packages/utils/fixture/src/widget/compile.ts',
      },
      {
        code: 'type CompileResult = { readonly exitCode: number }; export const compile = (): CompileResult => ({ exitCode: 0 });',
        errors: [{ messageId: 'requireSharedTypeFile' }],
        filename: '/repo/packages/utils/fixture/src/widget/compile.ts',
      },
      {
        code: 'type CompileResult = { readonly exitCode: number }; export const compile = () => { const result: CompileResult = { exitCode: 0 }; return result; };',
        errors: [{ messageId: 'requirePublicResultExport' }],
        filename: '/repo/packages/utils/fixture/src/widget/compile.ts',
      },
    ],
  },
);
