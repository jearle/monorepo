import { noNestedObjectTypeLiteralsRule } from './no-nested-object-type-literals.js';
import { preferReadonlyArraySyntaxRule } from './prefer-readonly-array-syntax.js';
import { createOxlintTestHarness } from './create-oxlint-test-harness.js';

const oxlintTestHarness = createOxlintTestHarness();

oxlintTestHarness.run(
  'monorepo-conventions/no-nested-object-type-literals',
  noNestedObjectTypeLiteralsRule,
  {
    valid: [
      {
        code: 'type Thing = { readonly id: string };',
      },
      {
        code: 'export type Thing = { readonly id: string };',
      },
      {
        code: 'type Child = { readonly id: string }; type Parent = { readonly child: Child; readonly children: readonly Child[] };',
      },
      {
        code: 'type Child = { readonly id: string }; interface Parent { readonly child: Child; }',
      },
      {
        code: 'type Thing = string | number;',
      },
    ],
    invalid: [
      {
        code: 'type Thing = { readonly child: { readonly id: string } };',
        errors: [{ messageId: 'noNestedObjectTypeLiteral' }],
      },
      {
        code: 'type Thing = { readonly children: readonly { readonly id: string }[] };',
        errors: [{ messageId: 'noNestedObjectTypeLiteral' }],
      },
      {
        code: 'type Thing = { readonly id: string } | { readonly name: string };',
        errors: [
          { messageId: 'noNestedObjectTypeLiteral' },
          { messageId: 'noNestedObjectTypeLiteral' },
        ],
      },
      {
        code: 'type Thing = BaseThing & { readonly id: string };',
        errors: [{ messageId: 'noNestedObjectTypeLiteral' }],
      },
      {
        code: 'type Thing = Promise<{ readonly id: string }>;',
        errors: [{ messageId: 'noNestedObjectTypeLiteral' }],
      },
      {
        code: 'type Thing = readonly [{ readonly id: string }];',
        errors: [{ messageId: 'noNestedObjectTypeLiteral' }],
      },
      {
        code: 'type Thing<Key extends string> = { readonly [Property in Key]: { readonly id: string } };',
        errors: [{ messageId: 'noNestedObjectTypeLiteral' }],
      },
      {
        code: 'type Thing = (props: { readonly id: string }) => { readonly ok: boolean };',
        errors: [
          { messageId: 'noNestedObjectTypeLiteral' },
          { messageId: 'noNestedObjectTypeLiteral' },
        ],
      },
      {
        code: 'const createThing = (props: { readonly id: string }) => props.id;',
        errors: [{ messageId: 'noNestedObjectTypeLiteral' }],
      },
      {
        code: 'interface Parent { readonly child: { readonly id: string }; }',
        errors: [{ messageId: 'noNestedObjectTypeLiteral' }],
      },
    ],
  },
);

oxlintTestHarness.run(
  'monorepo-conventions/prefer-readonly-array-syntax',
  preferReadonlyArraySyntaxRule,
  {
    valid: [
      {
        code: 'type Thing = { readonly values: readonly string[] };',
      },
      {
        code: 'type Matrix = readonly (readonly number[])[];',
      },
      {
        code: 'type Choice = readonly (string | number)[];',
      },
    ],
    invalid: [
      {
        code: 'type Thing = ReadonlyArray<string>;',
        errors: [{ messageId: 'preferReadonlyArraySyntax' }],
      },
      {
        code: 'type Thing = { readonly values: ReadonlyArray<string> };',
        errors: [{ messageId: 'preferReadonlyArraySyntax' }],
      },
      {
        code: 'type Thing = Promise<ReadonlyArray<string>>;',
        errors: [{ messageId: 'preferReadonlyArraySyntax' }],
      },
      {
        code: 'type Thing = ReadonlyArray<ReadonlyArray<string>>;',
        errors: [
          { messageId: 'preferReadonlyArraySyntax' },
          { messageId: 'preferReadonlyArraySyntax' },
        ],
      },
      {
        code: 'type Thing = (values: ReadonlyArray<string>) => void;',
        errors: [{ messageId: 'preferReadonlyArraySyntax' }],
      },
    ],
  },
);
