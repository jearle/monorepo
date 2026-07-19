import { createOxlintTestHarness } from './create-oxlint-test-harness.js';
import { preferCheckPredicateNamesRule } from './prefer-check-predicate-names.js';

const oxlintTestHarness = createOxlintTestHarness();

oxlintTestHarness.run(
  'monorepo-conventions/prefer-check-predicate-names',
  preferCheckPredicateNamesRule,
  {
    valid: [
      {
        code: 'const checkIsThing = (value: unknown): value is Thing => true;',
      },
      {
        code: 'const isThing = true;',
      },
      {
        code: 'const createThing = () => true;',
      },
      {
        code: 'const checkIsThing: (value: unknown) => boolean = predicate;',
        options: [{ requireBooleanValueNames: true }],
      },
      {
        code: 'const checkIsThing = predicate as (value: unknown) => boolean;',
        options: [{ requireBooleanValueNames: true }],
      },
      {
        code: 'const checkIsThing = predicate satisfies (value: unknown) => boolean;',
        options: [{ requireBooleanValueNames: true }],
      },
      {
        code: 'type CheckIsThing = (value: unknown) => boolean; const checkIsThing = predicate as CheckIsThing;',
        options: [{ requireBooleanValueNames: true }],
      },
      {
        code: 'type CheckIsThing = { (value: unknown): boolean }; const checkIsThing = predicate as CheckIsThing;',
        options: [{ requireBooleanValueNames: true }],
      },
      {
        code: 'type CheckIsThing = ((value: unknown) => boolean) & { readonly kind: string }; const checkIsThing = predicate as CheckIsThing;',
        options: [{ requireBooleanValueNames: true }],
      },
      {
        code: 'type CheckIsThing = ((value: unknown) => boolean) | ((value: string) => boolean); const checkIsThing = predicate as CheckIsThing;',
        options: [{ requireBooleanValueNames: true }],
      },
      {
        code: 'const { checkIsThing }: { readonly checkIsThing: (value: unknown) => boolean } = source;',
        options: [{ requireBooleanValueNames: true }],
      },
      {
        code: 'const { nested: { checkIsThing } }: { readonly nested: { readonly checkIsThing: (value: unknown) => boolean } } = source;',
        options: [{ requireBooleanValueNames: true }],
      },
      {
        code: 'const [checkIsThing]: [(value: unknown) => boolean] = source;',
        options: [{ requireBooleanValueNames: true }],
      },
      {
        code: 'type PredicateSet = { readonly checkIsThing: (value: unknown) => boolean }; const { checkIsThing }: PredicateSet = source;',
        options: [{ requireBooleanValueNames: true }],
      },
      {
        code: 'type PredicateTuple = [(value: unknown) => boolean]; const [checkIsThing]: PredicateTuple = source;',
        options: [{ requireBooleanValueNames: true }],
      },
      {
        code: 'type CheckIsThing = (value: unknown) => boolean; type NestedPredicates = { readonly checkIsThing: CheckIsThing }; type PredicateSet = { readonly nested: NestedPredicates }; const { nested: { checkIsThing } }: PredicateSet = source;',
        options: [{ requireBooleanValueNames: true }],
      },
      {
        code: 'type PredicateSet = { readonly checkIsThing: (value: unknown) => boolean }; const { checkIsThing } = source as PredicateSet;',
        options: [{ requireBooleanValueNames: true }],
      },
      {
        code: 'type PredicateSet = { readonly checkIsThing: (value: unknown) => boolean }; const { checkIsThing } = (source as PredicateSet)!;',
        options: [{ requireBooleanValueNames: true }],
      },
    ],
    invalid: [
      {
        code: 'const isThing = (value: unknown): value is Thing => true;',
        errors: [{ messageId: 'preferCheckPredicateName' }],
      },
      {
        code: 'const thing = { hasThing: () => true };',
        errors: [{ messageId: 'preferCheckPredicateName' }],
      },
      {
        code: 'function shouldRun() { return true; }',
        errors: [{ messageId: 'preferCheckPredicateName' }],
      },
      {
        code: 'const { isThing }: { readonly isThing: (value: unknown) => boolean } = source;',
        options: [{ requireBooleanValueNames: true }],
        errors: [{ messageId: 'preferCheckPredicateName' }],
      },
      {
        code: 'type PredicateSet = { readonly isThing: (value: unknown) => boolean }; const { isThing }: PredicateSet = source;',
        options: [{ requireBooleanValueNames: true }],
        errors: [{ messageId: 'preferCheckPredicateName' }],
      },
      {
        code: 'type PredicateTuple = [(value: unknown) => boolean]; const [isThing]: PredicateTuple = source;',
        options: [{ requireBooleanValueNames: true }],
        errors: [{ messageId: 'preferCheckPredicateName' }],
      },
      {
        code: 'type CheckIsThing = (value: unknown) => boolean; type NestedPredicates = { readonly isThing: CheckIsThing }; type PredicateSet = { readonly nested: NestedPredicates }; const { nested: { isThing } }: PredicateSet = source;',
        options: [{ requireBooleanValueNames: true }],
        errors: [{ messageId: 'preferCheckPredicateName' }],
      },
      {
        code: 'type PredicateSet = { readonly isThing: (value: unknown) => boolean }; const { isThing } = source as PredicateSet;',
        options: [{ requireBooleanValueNames: true }],
        errors: [{ messageId: 'preferCheckPredicateName' }],
      },
      {
        code: 'type PredicateSet = { readonly isThing: (value: unknown) => boolean }; const { isThing } = (source as PredicateSet)!;',
        options: [{ requireBooleanValueNames: true }],
        errors: [{ messageId: 'preferCheckPredicateName' }],
      },
      ...[
        'const checkIsReady = true;',
        'const checkIsReady: boolean = ready;',
        'const checkIsReady = checkReady();',
        'const { ready: checkIsReady } = state;',
        'const { checkIsReady = () => true } = state;',
        'const { nested: { checkIsReady } } = state;',
        'const { ...checkIsReady } = state;',
        'const [checkIsReady] = states;',
        'const checkIs = true;',
        'const checkHas = true;',
        'const checkCan = true;',
        'const checkShould = true;',
      ].map((code) => ({
        code,
        options: [{ requireBooleanValueNames: true }],
        errors: [{ messageId: 'preferBooleanPredicateValueName' }],
      })),
      {
        code: 'type CheckIsReady = CheckIsOther; type CheckIsOther = CheckIsReady; const checkIsReady = predicate as CheckIsReady;',
        options: [{ requireBooleanValueNames: true }],
        errors: [{ messageId: 'preferBooleanPredicateValueName' }],
      },
      {
        code: 'type CheckIsReady = ((value: unknown) => boolean) | boolean; const checkIsReady = predicate as CheckIsReady;',
        options: [{ requireBooleanValueNames: true }],
        errors: [{ messageId: 'preferBooleanPredicateValueName' }],
      },
      ...['is', 'has', 'can', 'should'].map((name) => ({
        code: `const ${name} = () => true;`,
        errors: [{ messageId: 'preferCheckPredicateName' }],
      })),
    ],
  },
);
