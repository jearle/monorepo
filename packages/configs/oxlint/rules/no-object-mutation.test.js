import { createOxlintTestHarness } from './create-oxlint-test-harness.js';
import { noObjectMutationRule } from './no-object-mutation.js';

const oxlintTestHarness = createOxlintTestHarness();

oxlintTestHarness.run(
  'monorepo-conventions/no-object-mutation',
  noObjectMutationRule,
  {
    valid: [
      {
        code: 'const result = values.map((value) => value.id);',
      },
      {
        code: 'const result = { ...thing, count: thing.count + 1 };',
      },
      {
        code: 'valueRef.current = value;',
        options: [{ allowCurrentPropertyAssignment: true }],
      },
      {
        code: 'valueRef.current++;',
        options: [{ allowCurrentPropertyAssignment: true }],
      },
      {
        code: 'Object.assign(target, source);',
      },
      {
        code: 'const result = Object.create(Object.prototype, descriptors);',
        options: [{ requireObjectMutationApiChecks: true }],
      },
      {
        code: 'const result = Object.freeze({ value });',
        options: [{ requireObjectMutationApiChecks: true }],
      },
    ],
    invalid: [
      {
        code: 'thing.count = 1;',
        errors: [{ messageId: 'noMemberAssignment' }],
      },
      {
        code: 'thing.count += 1;',
        errors: [{ messageId: 'noMemberAssignment' }],
      },
      {
        code: 'thing.count++;',
        errors: [{ messageId: 'noMemberUpdate' }],
      },
      {
        code: 'values.push(value);',
        errors: [{ messageId: 'noMutatingArrayMethod' }],
      },
      {
        code: 'values[`sort`]();',
        errors: [{ messageId: 'noMutatingArrayMethod' }],
      },
      {
        code: 'valueRef.current = value;',
        errors: [{ messageId: 'noMemberAssignment' }],
      },
      ...[
        'Object.assign(target, source);',
        'Object.defineProperties(target, descriptors);',
        'Object[`defineProperty`](target, key, descriptor);',
        'Object.preventExtensions(target);',
        'Object.seal(target);',
        'Object.setPrototypeOf(target, prototype);',
        'Reflect.defineProperty(target, key, descriptor);',
        'Reflect.deleteProperty(target, key);',
        'Reflect.preventExtensions(target);',
        'Reflect.set(target, key, value);',
        'Reflect.setPrototypeOf(target, prototype);',
      ].map((code) => ({
        code,
        options: [{ requireObjectMutationApiChecks: true }],
        errors: [{ messageId: 'noObjectMutationCall' }],
      })),
    ],
  },
);
