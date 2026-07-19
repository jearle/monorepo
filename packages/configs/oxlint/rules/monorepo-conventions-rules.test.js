import { noNestedTernariesRule } from './no-nested-ternaries.js';
import { noNullCompanionResultFieldsRule } from './no-null-companion-result-fields.js';
import { noDeprecatedZodApisRule } from './no-deprecated-zod-apis.js';
import { orderImportSpecifiersRule } from './order-import-specifiers.js';
import { preferArrayHeadDestructuringRule } from './prefer-array-head-destructuring.js';
import { preferBacktickStringLiteralsRule } from './prefer-backtick-string-literals.js';
import { preferConstantsOverEnumsRule } from './prefer-constants-over-enums.js';
import { preferExportedConstArrowFunctionsRule } from './prefer-exported-const-arrow-functions.js';
import { preferFunctionOwnedHelperTypeNamesRule } from './prefer-function-owned-helper-type-names.js';
import { preferInlineTypeExportsRule } from './prefer-inline-type-exports.js';
import { preferInlineTypeImportsRule } from './prefer-inline-type-imports.js';
import { preferTypeAliasesRule } from './prefer-type-aliases.js';
import { requireOptionsTypeSuffixRule } from './require-options-type-suffix.js';
import { requirePublicTypeReferenceExportsRule } from './require-public-type-reference-exports.js';
import { requireReadonlyTypePropertiesRule } from './require-readonly-type-properties.js';
import { requireUppercaseStatusValuesRule } from './require-uppercase-status-values.js';
import { createOxlintTestHarness } from './create-oxlint-test-harness.js';

const oxlintTestHarness = createOxlintTestHarness();

oxlintTestHarness.run(
  'monorepo-conventions/prefer-array-head-destructuring',
  preferArrayHeadDestructuringRule,
  {
    valid: [
      {
        code: 'const [result = null] = values;',
      },
      {
        code: 'const result = values[1] ?? null;',
      },
      {
        code: 'const result = values[0] ?? undefined;',
      },
      {
        code: 'const result: string | null = values[0] ?? null;',
      },
    ],
    invalid: [
      {
        code: 'const result = values[0] ?? null;',
        errors: [{ messageId: 'preferArrayHeadDestructuring' }],
        output: 'const [result = null] = values;',
      },
      {
        code: 'const result = values?.[0] ?? null;',
        errors: [{ messageId: 'preferArrayHeadDestructuring' }],
        output: 'const [result = null] = values ?? [];',
      },
      {
        code: 'const result = props.values?.[0] ?? null;',
        errors: [{ messageId: 'preferArrayHeadDestructuring' }],
        output: 'const [result = null] = props.values ?? [];',
      },
      {
        code: 'const result = props?.values[0] ?? null;',
        errors: [{ messageId: 'preferArrayHeadDestructuring' }],
        output: 'const [result = null] = props?.values ?? [];',
      },
    ],
  },
);

oxlintTestHarness.run(
  'monorepo-conventions/prefer-inline-type-imports',
  preferInlineTypeImportsRule,
  {
    valid: [
      {
        code: "import { type Thing, createThing } from './thing';\n\ntype Result = Thing;\nconst result = createThing();",
      },
      {
        code: "import type DefaultThing from './thing';\n\ntype Result = DefaultThing;",
      },
    ],
    invalid: [
      {
        code: "import type { Thing } from './thing';\n\ntype Result = Thing;",
        errors: [{ messageId: 'preferInlineTypeImports' }],
        output: "import { type Thing } from './thing';\n\ntype Result = Thing;",
      },
      {
        code: "import { Thing, createThing } from './thing';\n\ntype Result = Thing;\nconst result = createThing();",
        errors: [{ messageId: 'preferInlineTypeSpecifier' }],
        output:
          "import { type Thing, createThing } from './thing';\n\ntype Result = Thing;\nconst result = createThing();",
      },
    ],
  },
);

oxlintTestHarness.run(
  'monorepo-conventions/prefer-inline-type-exports',
  preferInlineTypeExportsRule,
  {
    valid: [
      {
        code: "export { type Thing, createThing } from './thing';",
      },
      {
        code: 'export type Thing = { readonly id: string };',
      },
    ],
    invalid: [
      {
        code: "export type { Thing, ThingOptions } from './thing';",
        errors: [{ messageId: 'preferInlineTypeExports' }],
        output: "export { type Thing, type ThingOptions } from './thing';",
      },
    ],
  },
);

oxlintTestHarness.run(
  'monorepo-conventions/order-import-specifiers',
  orderImportSpecifiersRule,
  {
    valid: [
      {
        code: "import { type Alpha, type Beta, CONSTANT_ALPHA, CONSTANT_BETA, createAlpha, createBeta } from './thing';",
      },
      {
        code:
          'import {\n' +
          '  type Alpha,\n' +
          '  type Beta,\n' +
          '  CONSTANT_ALPHA,\n' +
          '  CONSTANT_BETA,\n' +
          '  createAlpha,\n' +
          '  createBeta,\n' +
          "} from './thing';",
      },
      {
        code: "export { type Alpha, type Beta, CONSTANT_ALPHA, createAlpha } from './thing';",
      },
    ],
    invalid: [
      {
        code: "import { createBeta, CONSTANT_BETA, type Alpha, createAlpha, CONSTANT_ALPHA } from './thing';",
        errors: [{ messageId: 'orderImportSpecifiers' }],
        output:
          "import { type Alpha, CONSTANT_ALPHA, CONSTANT_BETA, createAlpha, createBeta } from './thing';",
      },
      {
        code: "export { createAlpha, type Alpha, CONSTANT_ALPHA } from './thing';",
        errors: [{ messageId: 'orderImportSpecifiers' }],
        output:
          "export { type Alpha, CONSTANT_ALPHA, createAlpha } from './thing';",
      },
      {
        code:
          'import {\n' +
          '  createBeta,\n' +
          '  CONSTANT_BETA,\n' +
          '  type Alpha,\n' +
          '  createAlpha,\n' +
          '  CONSTANT_ALPHA,\n' +
          "} from './thing';",
        errors: [{ messageId: 'orderImportSpecifiers' }],
        output:
          'import {\n' +
          '  type Alpha,\n' +
          '  CONSTANT_ALPHA,\n' +
          '  CONSTANT_BETA,\n' +
          '  createAlpha,\n' +
          '  createBeta,\n' +
          "} from './thing';",
      },
    ],
  },
);

oxlintTestHarness.run(
  'monorepo-conventions/prefer-backtick-string-literals',
  preferBacktickStringLiteralsRule,
  {
    valid: [
      {
        code: "import { createThing } from './thing';",
      },
      {
        code: "'use strict';",
      },
      {
        code: "declare module 'thing' {}",
      },
      {
        code: "type Thing = { readonly 'thing-id': string };",
      },
      {
        code: 'const result = `thing`;',
      },
    ],
    invalid: [
      {
        code: "const result = 'thing';",
        errors: [{ messageId: 'preferBacktickStringLiteral' }],
        output: 'const result = `thing`;',
      },
      {
        code: "const result = { 'thing-id': value };",
        errors: [{ messageId: 'preferBacktickObjectKey' }],
        output: 'const result = { [`thing-id`]: value };',
      },
      {
        code: 'const result = <Thing label="Create thing" />;',
        errors: [{ messageId: 'preferBacktickStringLiteral' }],
        filename: 'thing.tsx',
        output: 'const result = <Thing label={`Create thing`} />;',
      },
    ],
  },
);

oxlintTestHarness.run(
  'monorepo-conventions/prefer-type-aliases',
  preferTypeAliasesRule,
  {
    valid: [
      {
        code: 'type Thing = { readonly id: string };',
      },
      {
        code: "declare module 'thing' { interface Thing { readonly id: string } }",
      },
      {
        code: 'declare global { interface Window { readonly thing: string } }',
      },
    ],
    invalid: [
      {
        code: 'interface Thing { readonly id: string }',
        errors: [{ messageId: 'preferTypeAliases' }],
        output: 'type Thing = { readonly id: string };',
      },
      {
        code: 'export interface Thing { readonly id: string }',
        errors: [{ messageId: 'preferTypeAliases' }],
        output: 'export type Thing = { readonly id: string };',
      },
      {
        code: 'namespace Thing { export interface Nested { readonly id: string } }',
        errors: [{ messageId: 'preferTypeAliases' }],
        output:
          'namespace Thing { export type Nested = { readonly id: string }; }',
      },
      {
        code: 'interface Thing extends BaseThing { readonly id: string }',
        errors: [{ messageId: 'preferTypeAliases' }],
        output: 'type Thing = BaseThing & { readonly id: string };',
      },
    ],
  },
);

oxlintTestHarness.run(
  'monorepo-conventions/require-readonly-type-properties',
  requireReadonlyTypePropertiesRule,
  {
    valid: [
      {
        code: 'type Thing = { readonly id: string };',
      },
      {
        code: 'type Thing = { readonly createThing: () => string };',
      },
    ],
    invalid: [
      {
        code: 'type Thing = { id: string };',
        errors: [{ messageId: 'requireReadonlyTypeProperties' }],
        output: 'type Thing = { readonly id: string };',
      },
      {
        code: 'type Thing = { createThing: () => string };',
        errors: [{ messageId: 'requireReadonlyTypeProperties' }],
        output: 'type Thing = { readonly createThing: () => string };',
      },
    ],
  },
);

oxlintTestHarness.run(
  'monorepo-conventions/require-public-type-reference-exports',
  requirePublicTypeReferenceExportsRule,
  {
    valid: [
      {
        code: 'export type PublicValue = { readonly id: string }; export type PublicProps = { readonly value: PublicValue };',
      },
      {
        code: 'type PrivateValue = { readonly id: string }; type PrivateProps = { readonly value: PrivateValue };',
      },
      {
        code: 'export type CreateThingProps = { readonly id: string }; export const createThing = (props: CreateThingProps) => props;',
      },
    ],
    invalid: [
      {
        code: 'type PrivateValue = { readonly id: string }; export type PublicProps = { readonly value: PrivateValue };',
        errors: [{ messageId: 'requirePublicTypeReferenceExport' }],
      },
      {
        code: 'type PrivateValue = { readonly id: string }; export const createThing = (props: PrivateValue) => props;',
        errors: [{ messageId: 'requirePublicTypeReferenceExport' }],
      },
      {
        code: 'type PrivateValue = { readonly id: string }; export type PublicProps = { readonly values: readonly PrivateValue[] };',
        errors: [{ messageId: 'requirePublicTypeReferenceExport' }],
      },
    ],
  },
);

oxlintTestHarness.run(
  'monorepo-conventions/prefer-constants-over-enums',
  preferConstantsOverEnumsRule,
  {
    valid: [
      {
        code: 'const THING_STATUS_DONE = `DONE` as const;',
      },
    ],
    invalid: [
      {
        code: 'enum ThingStatus { Done = `DONE` }',
        errors: [{ messageId: 'preferConstantsOverEnums' }],
      },
    ],
  },
);

oxlintTestHarness.run(
  'monorepo-conventions/no-null-companion-result-fields',
  noNullCompanionResultFieldsRule,
  {
    valid: [
      {
        code: 'const result = { status: STATUS_SUCCESS, data: null };',
      },
      {
        code: 'const result = { status: STATUS_SUCCESS, data };',
      },
      {
        code: 'const result = { status: STATUS_ERROR, error };',
      },
      {
        code: 'const state = { isLoading: false, error: null, replies };',
      },
      {
        code: 'const result = { status: STATUS_SUCCESS, data, error };',
      },
      {
        code: 'const result = { status: STATUS_ERROR, data: undefined, error };',
      },
      {
        code: 'const result = { status: STATUS_SUCCESS, ...payload, error: null };',
      },
      {
        code: 'const result = { status: STATUS_SUCCESS, data, [errorKey]: null };',
      },
      {
        code: 'const result = { status: RESULT_STATUS_SUCCESS, data: null };',
      },
      {
        code:
          'type NullableDataResult = {\n' +
          '  readonly status: typeof STATUS_SUCCESS;\n' +
          '  readonly data: null;\n' +
          '};',
      },
      {
        code:
          'type NullableUnionResult = {\n' +
          '  readonly status: typeof STATUS_SUCCESS;\n' +
          '  readonly data: Data | null;\n' +
          '};',
      },
      {
        code:
          'type ErrorResult = {\n' +
          '  readonly status: typeof STATUS_ERROR;\n' +
          '  readonly error: ErrorPayload;\n' +
          '};',
      },
    ],
    invalid: [
      {
        code: 'const result = { status: STATUS_SUCCESS, data, error: null };',
        errors: [{ messageId: 'noNullCompanionResultField' }],
      },
      {
        code: 'const result = { status: STATUS_ERROR, data: null, error };',
        errors: [{ messageId: 'noNullCompanionResultField' }],
      },
      {
        code:
          'type Result =\n' +
          '  | {\n' +
          '      readonly status: typeof STATUS_SUCCESS;\n' +
          '      readonly data: Data;\n' +
          '      readonly error: null;\n' +
          '    }\n' +
          '  | {\n' +
          '      readonly status: typeof STATUS_ERROR;\n' +
          '      readonly data: null;\n' +
          '      readonly error: ErrorPayload;\n' +
          '    };',
        errors: [
          { messageId: 'noNullCompanionResultField' },
          { messageId: 'noNullCompanionResultField' },
        ],
      },
    ],
  },
);

oxlintTestHarness.run(
  'monorepo-conventions/require-uppercase-status-values',
  requireUppercaseStatusValuesRule,
  {
    valid: [
      {
        code: 'export const TASK_STATUS_DONE = `DONE`;',
      },
      {
        code: 'export const HTTP_STATUS_ERROR_CODE = `HTTP_STATUS`;',
      },
      {
        code: 'const TASK_STATUS_DONE = `done`;',
      },
      {
        code: 'export const TASK_STATUS_DONE = `done`;',
        options: [
          {
            allowedConstantValues: {
              TASK_STATUS_DONE: `done`,
            },
          },
        ],
      },
      {
        code: 'export const HTTP_INVALID_RETRYABLE_STATUS_ERROR = `Retry ${status}`;',
      },
    ],
    invalid: [
      {
        code: 'export const TASK_STATUS_DONE = `done`;',
        errors: [{ messageId: 'requireUppercaseStatusValues' }],
        output: 'export const TASK_STATUS_DONE = `DONE`;',
      },
      {
        code: 'export const HEALTH_STATUS_OK = "health-status-ok";',
        errors: [{ messageId: 'requireUppercaseStatusValues' }],
        output: 'export const HEALTH_STATUS_OK = `HEALTH_STATUS_OK`;',
      },
      {
        code: 'export const TOOL_CALL_STATUS_PENDING = `pending` as const;',
        errors: [{ messageId: 'requireUppercaseStatusValues' }],
        output: 'export const TOOL_CALL_STATUS_PENDING = `PENDING` as const;',
      },
    ],
  },
);

oxlintTestHarness.run(
  'monorepo-conventions/no-nested-ternaries',
  noNestedTernariesRule,
  {
    valid: [
      {
        code: 'const result = value === `a` ? `alpha` : `beta`;',
      },
    ],
    invalid: [
      {
        code: 'const result = value === `a` ? other === `b` ? `alpha` : `beta` : `gamma`;',
        errors: [{ messageId: 'noNestedTernary' }],
      },
      {
        code: 'const result = value === `a` ? `alpha` : other === `b` ? `beta` : `gamma`;',
        errors: [{ messageId: 'noNestedTernary' }],
        filename: 'nested-ternary.test.ts',
      },
    ],
  },
);

oxlintTestHarness.run(
  'monorepo-conventions/no-deprecated-zod-apis',
  noDeprecatedZodApisRule,
  {
    valid: [
      {
        code: "import { z } from 'zod'; const Schema = z.strictObject({ id: z.uuid(), count: z.int().min(0), email: z.email() });",
      },
      {
        code: "import { z } from 'zod'; const Schema = z.object({ id: z.string() });",
      },
      {
        code: "import { z } from 'zod'; const Schema = z.looseObject({ id: z.string() });",
      },
      {
        code: 'const merged = merge(left, right);',
      },
      {
        code: 'const issue = { code: ZOD_ISSUE_CODE_CUSTOM };',
      },
      {
        code: 'const z = { ZodIssueCode: { custom: `custom` } }; const issue = { code: z.ZodIssueCode.custom };',
      },
      {
        code: "import type { z } from 'zod'; const z = { ZodIssueCode: { custom: `custom` } }; const issue = { code: z.ZodIssueCode.custom };",
      },
      {
        code: "import { type z } from 'zod'; const z = { ZodIssueCode: { custom: `custom` } }; const issue = { code: z.ZodIssueCode.custom };",
      },
      {
        code: "import { type z } from '@hono/zod-openapi'; const z = { ZodIssueCode: { custom: `custom` } }; const issue = { code: z.ZodIssueCode.custom };",
      },
      {
        code: "import { z } from 'zod'; const getIssueCode = (z: { readonly ZodIssueCode: { readonly custom: string } }) => z.ZodIssueCode.custom;",
      },
    ],
    invalid: [
      {
        code: "import { z } from 'zod'; const Schema = z.object({ id: z.string() }).strict();",
        errors: [{ messageId: 'noDeprecatedZodApi' }],
      },
      {
        code: "import { z } from 'zod'; const Schema = z.object({ id: z.string() }).passthrough();",
        errors: [{ messageId: 'noDeprecatedZodApi' }],
      },
      {
        code: "import { z } from 'zod'; const Schema = z.number().finite();",
        errors: [{ messageId: 'noDeprecatedZodApi' }],
      },
      {
        code: "import { z } from 'zod'; const Schema = z.number().int().min(0);",
        errors: [{ messageId: 'noDeprecatedZodApi' }],
      },
      {
        code: "import { z } from 'zod'; const Schema = z.string().url();",
        errors: [{ messageId: 'noDeprecatedZodApi' }],
      },
      {
        code: 'const Schema = FirstSchema.merge(SecondSchema);',
        errors: [{ messageId: 'noDeprecatedZodApi' }],
      },
      {
        code: "import { z } from 'zod'; const Schema = z.nativeEnum(Thing);",
        errors: [{ messageId: 'noDeprecatedZodApi' }],
      },
      {
        code: "import { z } from 'zod'; const Schema = z.number().step(2);",
        errors: [{ messageId: 'noDeprecatedZodApi' }],
      },
      {
        code: "import { z } from 'zod'; const issue = { code: z.ZodIssueCode.custom };",
        errors: [{ messageId: 'noDeprecatedZodApi' }],
      },
      {
        code: "const issue = { code: z.ZodIssueCode.custom }; import { z } from 'zod';",
        errors: [{ messageId: 'noDeprecatedZodApi' }],
      },
      {
        code: "import { z } from 'zod/v4'; const issue = { code: z.ZodIssueCode.custom };",
        errors: [{ messageId: 'noDeprecatedZodApi' }],
      },
      {
        code: "import { z } from 'zod/v4/core'; const issue = { code: z.ZodIssueCode.custom };",
        errors: [{ messageId: 'noDeprecatedZodApi' }],
      },
      {
        code: "import { z as zz } from 'zod'; const issue = { code: zz.ZodIssueCode.custom };",
        errors: [{ messageId: 'noDeprecatedZodApi' }],
      },
      {
        code: "import * as zod from 'zod'; const issue = { code: zod.ZodIssueCode.custom };",
        errors: [{ messageId: 'noDeprecatedZodApi' }],
      },
      {
        code: "import zod from 'zod'; const issue = { code: zod.ZodIssueCode.custom };",
        errors: [{ messageId: 'noDeprecatedZodApi' }],
      },
      {
        code: "import { z } from '@hono/zod-openapi'; const issue = { code: z.ZodIssueCode.custom };",
        errors: [{ messageId: 'noDeprecatedZodApi' }],
      },
    ],
  },
);

oxlintTestHarness.run(
  'monorepo-conventions/prefer-exported-const-arrow-functions',
  preferExportedConstArrowFunctionsRule,
  {
    valid: [
      {
        code: 'export const createThing = (props: CreateThingProps) => props;',
      },
      {
        code: 'const createThing = function (props: CreateThingProps) { return props; };',
      },
      {
        code: 'export const VALUE = 1;',
      },
    ],
    invalid: [
      {
        code: 'export function createThing(props: CreateThingProps) { return props; }',
        errors: [{ messageId: 'preferExportedConstArrowFunction' }],
        output:
          'export const createThing = (props: CreateThingProps) => { return props; };',
      },
      {
        code: 'export async function createThing() { return null; }',
        errors: [{ messageId: 'preferExportedConstArrowFunction' }],
        output: 'export const createThing = async () => { return null; };',
      },
      {
        code: 'export default function createThing() { return null; }',
        errors: [{ messageId: 'preferNamedExport' }],
      },
      {
        code: 'export const createThing = function (props: CreateThingProps) { return props; };',
        errors: [{ messageId: 'preferExportedConstArrowFunction' }],
        output:
          'export const createThing = (props: CreateThingProps) => { return props; };',
      },
    ],
  },
);

oxlintTestHarness.run(
  'monorepo-conventions/require-options-type-suffix',
  requireOptionsTypeSuffixRule,
  {
    valid: [
      {
        code: 'const createThing = (options: CreateThingOptions = {}) => options;',
      },
      {
        code: 'type CreateThingProps = { readonly options: CreateThingOptions };',
      },
      {
        code: 'type CreateThingProps = { readonly retryConfig: RetryConfig };',
      },
    ],
    invalid: [
      {
        code: 'const createThing = (options: CreateThingConfig = {}) => options;',
        errors: [{ messageId: 'requireOptionsTypeSuffix' }],
      },
      {
        code: 'const createThing = (options: { readonly limit: number }) => options;',
        errors: [{ messageId: 'requireOptionsTypeSuffix' }],
      },
      {
        code: 'type CreateThingProps = { readonly options: ResolvedCreateThingConfig };',
        errors: [{ messageId: 'requireOptionsTypeSuffix' }],
      },
    ],
  },
);

oxlintTestHarness.run(
  'monorepo-conventions/prefer-function-owned-helper-type-names',
  preferFunctionOwnedHelperTypeNamesRule,
  {
    valid: [
      {
        code: 'type CreateThingProps = { readonly id: string }; const createThing = (props: CreateThingProps) => props;',
      },
      {
        code: 'type CreateThingOptions = { readonly limit?: number }; const createThing = (options: CreateThingOptions = {}) => options;',
      },
      {
        code: 'type CreateThingContext = { readonly id: string }; const createThing = (ctx: CreateThingContext) => ctx;',
      },
      {
        code: 'type CreateThingResult = { readonly id: string }; const createThing = (): CreateThingResult => ({ id: `thing` });',
      },
      {
        code: 'const createThing = (props: CreateThingProps) => props; type CreateThingProps = { readonly id: string };',
      },
      {
        code: 'type SharedProps<T> = { readonly value: T }; const createThing = (props: SharedProps<string>) => props;',
      },
      {
        code: 'const createThing = (props: ImportedThingProps) => props;',
      },
      {
        code: 'type Create__skeletonProps = { readonly id: string }; const create__skeleton = (props: Create__skeletonProps) => props;',
      },
    ],
    invalid: [
      {
        code: 'type ThingProps = { readonly id: string }; const createThing = (props: ThingProps) => props;',
        errors: [{ messageId: 'preferFunctionOwnedHelperTypeName' }],
      },
      {
        code: 'type ThingOptions = { readonly limit?: number }; const createThing = (options: ThingOptions = {}) => options;',
        errors: [{ messageId: 'preferFunctionOwnedHelperTypeName' }],
      },
      {
        code: 'type ThingContext = { readonly id: string }; const createThing = (ctx: ThingContext) => ctx;',
        errors: [{ messageId: 'preferFunctionOwnedHelperTypeName' }],
      },
      {
        code: 'type ThingResult = { readonly id: string }; const createThing = (): ThingResult => ({ id: `thing` });',
        errors: [{ messageId: 'preferFunctionOwnedHelperTypeName' }],
      },
      {
        code: 'const createThing = (props: ThingProps) => props; type ThingProps = { readonly id: string };',
        errors: [{ messageId: 'preferFunctionOwnedHelperTypeName' }],
      },
    ],
  },
);
