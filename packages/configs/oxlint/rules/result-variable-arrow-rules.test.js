import { createOxlintTestHarness } from './create-oxlint-test-harness.js';
import { requireResultVariableReturnRule } from './require-result-variable-return.js';

const oxlintTestHarness = createOxlintTestHarness();

oxlintTestHarness.run(
  'monorepo-conventions/require-result-variable-return',
  requireResultVariableReturnRule,
  {
    valid: [
      {
        code: 'const createValue = () => ({ value });',
      },
      {
        code: 'const createValues = () => [value];',
      },
      ...[
        'const createValue = () => value;',
        'const createValue = () => { const result = { value }; return result; };',
        'const createValues = () => { const result = [value]; return result; };',
      ].map((code) => ({
        code,
        options: [{ requireAllNonTrivialReturns: true }],
      })),
    ],
    invalid: [
      ...[
        'const createValue = () => ({ value });',
        'const createValues = () => [value];',
        'const createValue = () => createOther();',
      ].map((code) => ({
        code,
        options: [{ requireAllNonTrivialReturns: true }],
        errors: [{ messageId: `requireNonTrivialVariableReturn` }],
      })),
      {
        code: 'const createValue = () => { return { value }; };',
        options: [{ requireAllNonTrivialReturns: true }],
        errors: [{ messageId: `requireNonTrivialVariableReturn` }],
      },
      {
        code: 'const createValues = () => { return [value]; };',
        options: [{ requireAllNonTrivialReturns: true }],
        errors: [{ messageId: `requireNonTrivialVariableReturn` }],
      },
    ],
  },
);
