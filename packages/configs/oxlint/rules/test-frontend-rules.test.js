import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { noInternalModuleMocksRule } from './no-internal-module-mocks.js';
import { preferTestPublicEntrypointImportsRule } from './prefer-test-public-entrypoint-imports.js';
import { requireJotaiHookResultObjectRule } from './require-jotai-hook-result-object.js';
import { requireTsExpectErrorDescriptionRule } from './require-ts-expect-error-description.js';
import { requireUiComponentExamplesRule } from './require-ui-component-examples.js';
import { createOxlintTestHarness } from './create-oxlint-test-harness.js';

const oxlintTestHarness = createOxlintTestHarness();
const fixtureRoot = fs.mkdtempSync(
  path.join(os.tmpdir(), `monorepo-oxlint-rule-fixtures-`),
);

const createEntrypointFixtureDirectory = (name, indexText) => {
  const directory = path.join(fixtureRoot, name);

  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, `index.ts`), indexText);

  return directory;
};

const publicEntrypointFixtureDirectory = createEntrypointFixtureDirectory(
  `public-entrypoint`,
  "export * from './create-thing';\n",
);
const namedPublicEntrypointFixtureDirectory = createEntrypointFixtureDirectory(
  `named-public-entrypoint`,
  "export { createThing } from './create-thing';\n",
);
const privateHelperFixtureDirectory = createEntrypointFixtureDirectory(
  `private-helper`,
  "export * from './create-public-thing';\n",
);

const getFixtureFilename = (directory, filename) => {
  const result = path.join(directory, filename);

  return result;
};

oxlintTestHarness.run(
  'monorepo-conventions/prefer-test-public-entrypoint-imports',
  preferTestPublicEntrypointImportsRule,
  {
    valid: [
      {
        code: "import { createThing } from '.';",
        filename: '/repo/packages/utils/thing/src/thing/create-thing.test.ts',
      },
      {
        code: "import { THING_FIXTURE } from './thing-fixtures';",
        filename: '/repo/packages/utils/thing/src/thing/create-thing.test.ts',
      },
      {
        code: "import './styles.css';",
        filename: '/repo/packages/uis/thing/src/thing/Thing.test.tsx',
      },
      {
        code: "import { createThing } from './create-thing';",
        filename: '/repo/packages/utils/thing/src/thing/create-thing.ts',
      },
      {
        code: "import { createPrivateThing } from './create-private-thing';",
        filename: getFixtureFilename(
          privateHelperFixtureDirectory,
          `create-private-thing.test.ts`,
        ),
      },
    ],
    invalid: [
      {
        code: "import { createThing } from './create-thing';",
        errors: [{ messageId: 'preferTestPublicEntrypointImport' }],
        filename: getFixtureFilename(
          publicEntrypointFixtureDirectory,
          `create-thing.test.ts`,
        ),
        output: "import { createThing } from '.';",
      },
      {
        code: "import { createThing } from './create-thing';",
        errors: [{ messageId: 'preferTestPublicEntrypointImport' }],
        filename: getFixtureFilename(
          namedPublicEntrypointFixtureDirectory,
          `create-thing.test.ts`,
        ),
        output: "import { createThing } from '.';",
      },
      {
        code: "import { createThing } from './';",
        errors: [{ messageId: 'preferTestPublicEntrypointImport' }],
        filename: '/repo/packages/utils/thing/src/thing/create-thing.test.ts',
        output: "import { createThing } from '.';",
      },
    ],
  },
);

oxlintTestHarness.run(
  'monorepo-conventions/require-ts-expect-error-description',
  requireTsExpectErrorDescriptionRule,
  {
    valid: [
      {
        code: '// @ts-expect-error: value must be a number\nround({ value: `4.6` });',
      },
      {
        code: 'round({ value: 4.6 });',
      },
    ],
    invalid: [
      {
        code: '// @ts-ignore\nround({ value: `4.6` });',
        errors: [{ messageId: 'noTsIgnore' }],
      },
      {
        code: '// @ts-expect-error\nround({ value: `4.6` });',
        errors: [{ messageId: 'requireTsExpectErrorDescription' }],
      },
      {
        code: '// @ts-expect-error:\nround({ value: `4.6` });',
        errors: [{ messageId: 'requireTsExpectErrorDescription' }],
      },
    ],
  },
);

oxlintTestHarness.run(
  'monorepo-conventions/no-internal-module-mocks',
  noInternalModuleMocksRule,
  {
    valid: [
      {
        code: "vi.mock('external-package');",
        filename: '/repo/packages/utils/thing/src/thing/create-thing.test.ts',
      },
      {
        code: "vi.mock('./create-thing');",
        filename: '/repo/packages/utils/thing/src/thing/create-thing.ts',
      },
      {
        code: "const mockMethod = 'mock'; vi[mockMethod]('./create-thing');",
        filename: '/repo/packages/utils/thing/src/thing/create-thing.test.ts',
      },
    ],
    invalid: [
      {
        code: "vi.mock('./create-thing');",
        errors: [{ messageId: 'noInternalModuleMock' }],
        filename: '/repo/packages/utils/thing/src/thing/create-thing.test.ts',
      },
      {
        code: "jest.doMock('@jearle/util-logger/src/logger/create-logger');",
        errors: [{ messageId: 'noInternalModuleMock' }],
        filename: '/repo/packages/utils/thing/src/thing/create-thing.test.ts',
      },
      {
        code: "jest.doMock('@jearle/util-logger/logger');",
        errors: [{ messageId: 'noInternalModuleMock' }],
        filename: '/repo/packages/utils/thing/src/thing/create-thing.test.ts',
      },
      {
        code: "vi['mock']('./create-thing');",
        errors: [{ messageId: 'noInternalModuleMock' }],
        filename: '/repo/packages/utils/thing/src/thing/create-thing.test.ts',
      },
      {
        code: "mock.module('./create-thing');",
        errors: [{ messageId: 'noInternalModuleMock' }],
        filename: '/repo/packages/utils/thing/src/thing/create-thing.test.ts',
      },
    ],
  },
);

oxlintTestHarness.run(
  'monorepo-conventions/require-ui-component-examples',
  requireUiComponentExamplesRule,
  {
    valid: [
      {
        code: 'export const Button = () => <button />;',
        filename: '/repo/packages/uis/core/src/button/Button.tsx',
        options: [
          {
            exampleFilenames: [
              '/repo/packages/uis/core/src/button/Example.tsx',
            ],
          },
        ],
      },
      {
        code: 'export const ButtonExample = () => <button />;',
        filename: '/repo/packages/uis/core/src/button/ButtonExample.tsx',
      },
      {
        code: 'export const Feature = () => <div />;',
        filename: '/repo/packages/apps/web/src/feature/Feature.tsx',
      },
      {
        code: 'export type ButtonProps = { readonly label: string; };',
        filename: '/repo/packages/uis/core/src/button/Button.tsx',
      },
    ],
    invalid: [
      {
        code: 'export const Button = () => <button />;',
        errors: [{ messageId: 'requireUiComponentExample' }],
        filename: '/repo/packages/uis/core/src/button/Button.tsx',
      },
      {
        code: 'const Button = () => <button />; export { Button };',
        errors: [{ messageId: 'requireUiComponentExample' }],
        filename: '/repo/packages/uis/core/src/button/Button.tsx',
      },
    ],
  },
);

oxlintTestHarness.run(
  'monorepo-conventions/require-jotai-hook-result-object',
  requireJotaiHookResultObjectRule,
  {
    valid: [
      {
        code: 'export const useUserState = () => { const isLoading = useAtomValue(isLoadingUserState); const error = useAtomValue(userErrorState); const user = useAtomValue(userState); const result = { isLoading, error, user }; return result; };',
      },
      {
        code: 'export const useUser = () => { const user = useAtomValue(userState); return user; };',
      },
      {
        code: 'export const useUserState = () => { const user = createUser(); return user; };',
      },
      {
        code: 'export const useUserState = () => { const result = { isLoading: false, error: null }; return result; };',
      },
    ],
    invalid: [
      {
        code: 'export const useUserState = () => { const user = useAtomValue(userState); return { user }; };',
        errors: [{ messageId: 'requireJotaiHookResultObject' }],
      },
      {
        code: 'export const useUserState = () => { const isLoading = useAtomValue(isLoadingUserState); const error = useAtomValue(userErrorState); const user = useAtomValue(userState); const result = { isLoading, error }; return result; };',
        errors: [{ messageId: 'requireJotaiHookResultProperty' }],
      },
      {
        code: 'export const useUserState = () => { const isLoading = useAtomValue(isLoadingUserState); const user = useAtomValue(userState); const result = { isLoading, user }; return result; };',
        errors: [{ messageId: 'requireJotaiHookErrorProperty' }],
      },
      {
        code: 'export const useUserState = () => { const error = useAtomValue(userErrorState); const user = useAtomValue(userState); const result = { error, user }; return result; };',
        errors: [{ messageId: 'requireJotaiHookLoadingProperty' }],
      },
      {
        code: 'export const useUserState = () => { const result = { isLoading: false, user: 1 }; return result; };',
        errors: [{ messageId: 'requireJotaiHookErrorProperty' }],
      },
    ],
  },
);
