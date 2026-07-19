import { noDirectProcessEnvRule } from './no-direct-process-env.js';
import { noProcessEnvCastsRule } from './no-process-env-casts.js';
import { noThrownBoundaryValidationErrorsRule } from './no-thrown-boundary-validation-errors.js';
import { preferBoundarySafeParseRule } from './prefer-boundary-safe-parse.js';
import { preferSchemaDerivedTypesRule } from './prefer-schema-derived-types.js';
import { requireLocalSchemaFileNamesRule } from './require-local-schema-file-names.js';
import { createOxlintTestHarness } from './create-oxlint-test-harness.js';

const oxlintTestHarness = createOxlintTestHarness();

oxlintTestHarness.run(
  'monorepo-conventions/require-local-schema-file-names',
  requireLocalSchemaFileNamesRule,
  {
    valid: [
      {
        code: 'import { z } from "zod"; export const MessageSchema = z.object({ id: z.string() });',
        filename: '/repo/packages/utils/llm/src/chat/message-schema.ts',
      },
      {
        code: 'import { z } from "zod"; export const EnvSchema = z.object({ NODE_ENV: z.string() });',
        filename: '/repo/packages/services/thing/src/env/env-schema.ts',
      },
      {
        code: 'import { z } from "zod"; export const UserSchema = z.object({ id: z.string() });',
        filename: '/repo/packages/schemas/user/src/user/schemas.ts',
      },
      {
        code: 'import { z } from "zod"; const TestSchema = z.object({ id: z.string() });',
        filename: '/repo/packages/utils/thing/src/thing/create-thing.test.ts',
      },
    ],
    invalid: [
      {
        code: 'import { z } from "zod"; const MessageSchema = z.object({ id: z.string() });',
        errors: [{ messageId: 'requireLocalSchemaFileName' }],
        filename: '/repo/packages/utils/llm/src/chat/extract-message-text.ts',
      },
      {
        code: 'import { z } from "zod"; const MessageSchema = z.object({ id: z.string() });',
        errors: [{ messageId: 'requireLocalSchemaFileName' }],
        filename: '/repo/packages/utils/llm/src/chat/schemas.ts',
      },
    ],
  },
);

oxlintTestHarness.run(
  'monorepo-conventions/no-direct-process-env',
  noDirectProcessEnvRule,
  {
    valid: [
      {
        code: 'const { env } = createEnv();',
        filename: '/repo/packages/apis/thing/src/main.ts',
      },
      {
        code: 'const validationResult = validateEnv({ EnvSchema, env: process.env });',
        filename: '/repo/packages/utils/env/src/env/parse-env.ts',
      },
      {
        code: 'const validationResult = validateEnv({ EnvSchema, env: { ...process.env } });',
        filename:
          '/repo/packages/clis/utils/src/utils-command/create-utils-env-validate-command.ts',
      },
    ],
    invalid: [
      {
        code: 'const port = process.env.PORT;',
        errors: [{ messageId: 'noDirectProcessEnv' }],
        filename: '/repo/packages/apis/thing/src/main.ts',
      },
      {
        code: 'const { PORT } = process.env;',
        errors: [{ messageId: 'noDirectProcessEnv' }],
        filename: '/repo/packages/apis/thing/src/main.ts',
      },
      {
        code: 'const env = { ...process.env };',
        errors: [{ messageId: 'noDirectProcessEnv' }],
        filename: '/repo/packages/apis/thing/src/main.ts',
      },
    ],
  },
);

oxlintTestHarness.run(
  'monorepo-conventions/no-process-env-casts',
  noProcessEnvCastsRule,
  {
    valid: [
      {
        code: 'const { env } = createEnv();',
      },
    ],
    invalid: [
      {
        code: 'const port = process.env.PORT as string;',
        errors: [{ messageId: 'noProcessEnvCast' }],
      },
      {
        code: 'const port = process.env.PORT!;',
        errors: [{ messageId: 'noProcessEnvCast' }],
      },
      {
        code: 'const env = process.env as Record<string, string>;',
        errors: [{ messageId: 'noProcessEnvCast' }],
      },
    ],
  },
);

oxlintTestHarness.run(
  'monorepo-conventions/prefer-boundary-safe-parse',
  preferBoundarySafeParseRule,
  {
    valid: [
      {
        code: 'const parsed = UserSchema.safeParse(value);',
        filename: '/repo/packages/apis/thing/src/thing/add-thing-routes.ts',
      },
      {
        code: 'const parsed = JSON.parse(text);',
        filename: '/repo/packages/apis/thing/src/thing/add-thing-routes.ts',
      },
      {
        code: 'export const VALUE = UserSchema.parse({ id: `thing` });',
        filename: '/repo/packages/schemas/thing/src/thing/schemas.ts',
      },
      {
        code: 'const parsed = UserSchema.parse(value);',
        filename:
          '/repo/packages/apis/thing/src/thing/add-thing-routes.test.ts',
      },
    ],
    invalid: [
      {
        code: 'const user = UserSchema.parse(value);',
        errors: [{ messageId: 'preferBoundarySafeParse' }],
        filename: '/repo/packages/apis/thing/src/thing/add-thing-routes.ts',
      },
      {
        code: 'const request = requestSchema.parse(value);',
        errors: [{ messageId: 'preferBoundarySafeParse' }],
        filename: '/repo/packages/apps/thing/src/thing/dataset-route-client.ts',
      },
    ],
  },
);

oxlintTestHarness.run(
  'monorepo-conventions/no-thrown-boundary-validation-errors',
  noThrownBoundaryValidationErrorsRule,
  {
    valid: [
      {
        code: 'if (validationResult.success === false) { const result = { success: false, error: validationResult.error }; return result; }',
        filename: '/repo/packages/apis/thing/src/thing/add-thing-routes.ts',
      },
      {
        code: 'throw new Error(`failed`);',
        filename: '/repo/packages/apis/thing/src/thing/add-thing-routes.ts',
      },
      {
        code: 'throw validationResult.error;',
        filename: '/repo/packages/schemas/thing/src/thing/schemas.ts',
      },
    ],
    invalid: [
      {
        code: 'throw validationResult.error;',
        errors: [{ messageId: 'noThrownBoundaryValidationError' }],
        filename: '/repo/packages/apis/thing/src/thing/add-thing-routes.ts',
      },
      {
        code: 'throw new Error(validationResult.error.message);',
        errors: [{ messageId: 'noThrownBoundaryValidationError' }],
        filename: '/repo/packages/apis/thing/src/thing/add-thing-routes.ts',
      },
      {
        code: 'throw new z.ZodError([]);',
        errors: [{ messageId: 'noThrownBoundaryValidationError' }],
        filename: '/repo/packages/apis/thing/src/thing/add-thing-routes.ts',
      },
    ],
  },
);

oxlintTestHarness.run(
  'monorepo-conventions/prefer-schema-derived-types',
  preferSchemaDerivedTypesRule,
  {
    valid: [
      {
        code: 'import { type z } from "zod"; import { type UserSchema } from "./schemas"; export type User = z.infer<typeof UserSchema>;',
        filename: '/repo/packages/schemas/user/src/user/types.ts',
      },
      {
        code: 'export const ThingSchema = z.enum(THING_VALUES); export type Thing = (typeof THING_VALUES)[number];',
        filename: '/repo/packages/schemas/thing/src/thing/types.ts',
      },
      {
        code: 'export const UserSchema = z.object({ id: z.string() }); export type User = { readonly id: string };',
        filename: '/repo/packages/utils/thing/src/thing/types.ts',
      },
    ],
    invalid: [
      {
        code: 'export const UserSchema = z.object({ id: z.string() }); export type User = { readonly id: string };',
        errors: [{ messageId: 'preferSchemaDerivedType' }],
        filename: '/repo/packages/schemas/user/src/user/types.ts',
      },
      {
        code: 'import { type UserSchema } from "./schemas"; export type User = Readonly<{ readonly id: string }>;',
        errors: [{ messageId: 'preferSchemaDerivedType' }],
        filename: '/repo/packages/schemas/user/src/user/types.ts',
      },
    ],
  },
);
