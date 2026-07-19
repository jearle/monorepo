import { noDefaultExportsRule } from './no-default-exports.js';
import { noExternalServiceWorkflowImportsRule } from './no-external-service-workflow-imports.js';
import { noSchemaPackageBehaviorExportsRule } from './no-schema-package-behavior-exports.js';
import { preferPublicEntrypointImportsRule } from './prefer-public-entrypoint-imports.js';
import { requireCliMainShebangRule } from './require-cli-main-shebang.js';
import { requireErrorMessageHelpersInErrorModulesRule } from './require-error-message-helpers-in-error-modules.js';
import { requireIndexReexportsRule } from './require-index-reexports.js';
import { requirePublicExportFilenameRule } from './require-public-export-filename.js';
import { requireServiceFactoryContextRule } from './require-service-factory-context.js';
import { requireServiceInfoMethodRule } from './require-service-info-method.js';
import { requireShallowSrcStructureRule } from './require-shallow-src-structure.js';
import { createOxlintTestHarness } from './create-oxlint-test-harness.js';

const oxlintTestHarness = createOxlintTestHarness();

oxlintTestHarness.run(
  'monorepo-conventions/no-default-exports',
  noDefaultExportsRule,
  {
    valid: [
      {
        code: 'export const createThing = () => null;',
      },
    ],
    invalid: [
      {
        code: 'export default createThing;',
        errors: [{ messageId: 'noDefaultExport' }],
        output: 'export { createThing };',
      },
      {
        code: 'export default function createThing() { return null; }',
        errors: [{ messageId: 'noDefaultExport' }],
        output: 'export function createThing() { return null; }',
      },
      {
        code: 'export default function () { return null; }',
        errors: [{ messageId: 'noDefaultExport' }],
        output: null,
      },
    ],
  },
);

oxlintTestHarness.run(
  'monorepo-conventions/no-external-service-workflow-imports',
  noExternalServiceWorkflowImportsRule,
  {
    valid: [
      {
        code: "import { createBehaviorDatasetsService } from '@jearle/service-behavior-datasets';",
        filename:
          '/repo/packages/apps/quick-labeler/src/services/create-services.ts',
      },
      {
        code: "import { type BehaviorDatasetsService } from '@jearle/service-behavior-datasets';",
        filename: '/repo/packages/apps/quick-labeler/src/services/types.ts',
      },
      {
        code: "import { createTestUser } from '@jearle/service-authentication/test';",
        filename:
          '/repo/packages/apis/prompt-defense/src/prompt-defense-app/add-detect-routes.test.ts',
      },
      {
        code: "import { extractConversationText } from '@jearle/service-behavior-datasets';",
        filename:
          '/repo/packages/services/behavior-datasets/src/behavior-datasets-service/create-behavior-datasets-service.ts',
      },
      {
        code: "import { createCredentialsStore } from '@jearle/service-llm-profiles';",
        filename:
          '/repo/packages/apps/monorepo-api/src/services/create-services.ts',
      },
    ],
    invalid: [
      {
        code: "import { extractConversationText } from '@jearle/service-behavior-datasets';",
        errors: [{ messageId: 'noExternalServiceWorkflowImport' }],
        filename:
          '/repo/packages/apps/quick-labeler/src/dataset-quality/create-row.ts',
      },
      {
        code: "import { extractConversationText } from '@jearle/service-behavior-datasets/conversation-text';",
        errors: [{ messageId: 'noExternalServiceWorkflowImport' }],
        filename:
          '/repo/packages/apps/quick-labeler/src/dataset-quality/create-row.ts',
      },
      {
        code: "import { validateRows } from '@jearle/service-behavior-datasets';",
        errors: [{ messageId: 'noExternalServiceWorkflowImport' }],
        filename:
          '/repo/packages/apps/quick-labeler/src/dataset-quality/create-row.ts',
      },
      {
        code: "import { createRow } from '@jearle/service-behavior-datasets';",
        errors: [{ messageId: 'noExternalServiceWorkflowImport' }],
        filename:
          '/repo/packages/apps/quick-labeler/src/dataset-quality/create-row.ts',
      },
    ],
  },
);

oxlintTestHarness.run(
  'monorepo-conventions/no-schema-package-behavior-exports',
  noSchemaPackageBehaviorExportsRule,
  {
    valid: [
      {
        code: 'export const UserSchema = z.strictObject({ id: z.string() });',
        filename: '/repo/packages/schemas/user/src/user/schemas.ts',
      },
      {
        code: 'export const refineUser = (props: RefineUserProps) => null;',
        filename: '/repo/packages/schemas/user/src/user/refine-user.ts',
      },
      {
        code: 'export const extractUser = (props: ExtractUserProps) => props;',
        filename: '/repo/packages/utils/user/src/user/extract-user.ts',
      },
    ],
    invalid: [
      {
        code: 'export const extractUserContent = (props: ExtractUserContentProps) => props;',
        errors: [{ messageId: 'noSchemaPackageBehaviorExport' }],
        filename:
          '/repo/packages/schemas/user/src/user/extract-user-content.ts',
      },
      {
        code: 'export const normalizeUserContent = (props: NormalizeUserContentProps) => props;',
        errors: [{ messageId: 'noSchemaPackageBehaviorExport' }],
        filename:
          '/repo/packages/schemas/user/src/user/normalize-user-content.ts',
      },
      {
        code: 'export const validateUserContent = (props: ValidateUserContentProps) => props;',
        errors: [{ messageId: 'noSchemaPackageBehaviorExport' }],
        filename:
          '/repo/packages/schemas/user/src/user/validate-user-content.ts',
      },
    ],
  },
);

oxlintTestHarness.run(
  'monorepo-conventions/require-error-message-helpers-in-error-modules',
  requireErrorMessageHelpersInErrorModulesRule,
  {
    valid: [
      {
        code: 'export type CreateThingErrorMessageProps = { readonly id: string }; export const createThingErrorMessage = (props: CreateThingErrorMessageProps) => props.id;',
        filename: '/repo/packages/utils/thing/src/thing/errors.ts',
      },
      {
        code: 'export type CreateThingErrorMessageProps = { readonly id: string }; export const createThingErrorMessage = (props: CreateThingErrorMessageProps) => props.id;',
        filename: '/repo/packages/utils/thing/src/errors/errors.ts',
      },
      {
        code: 'export type CreateErrorMessageWithCauseProps = { readonly cause: Error }; export const createErrorMessageWithCause = (props: CreateErrorMessageWithCauseProps) => props.cause.message;',
        filename:
          '/repo/packages/utils/error/src/create-error-message-with-cause/create-error-message-with-cause.ts',
      },
      {
        code: 'export type CreateThingResponseProps = { readonly id: string }; export const createThingResponse = (props: CreateThingResponseProps) => props.id;',
        filename:
          '/repo/packages/utils/thing/src/thing/create-thing-response.ts',
      },
      {
        code: 'type CreateThingErrorProps = { readonly id: string }; const createThingError = (props: CreateThingErrorProps) => props.id; const THING_ERROR_MESSAGE_BY_CODE = {};',
        filename: '/repo/packages/utils/thing/src/thing/errors.ts',
      },
      {
        code: 'export const getOnError = () => { const onError = () => null; return { onError }; };',
        filename: '/repo/packages/libs/hono/src/on-error/get-on-error.ts',
        options: [{ requirePrivateErrorHelpers: true }],
      },
    ],
    invalid: [
      {
        code: 'export type CreateThingErrorMessageProps = { readonly id: string }; export const createThingErrorMessage = (props: CreateThingErrorMessageProps) => props.id;',
        errors: [
          { messageId: 'requireErrorMessageModule' },
          { messageId: 'requireErrorMessageModule' },
        ],
        filename:
          '/repo/packages/utils/thing/src/thing/create-thing-error-message.ts',
      },
      {
        code: 'type CreateThingErrorProps = { readonly id: string }; const createThingError = (props: CreateThingErrorProps) => props.id;',
        errors: [
          { messageId: 'requireErrorMessageModule' },
          { messageId: 'requireErrorMessageModule' },
        ],
        filename: '/repo/packages/utils/thing/src/thing/create-thing.ts',
        options: [{ requirePrivateErrorHelpers: true }],
      },
      {
        code: 'const THING_ERROR_MESSAGE_BY_CODE = {};',
        errors: [{ messageId: 'requireErrorMessageModule' }],
        filename: '/repo/packages/utils/thing/src/thing/create-thing.ts',
        options: [{ requirePrivateErrorHelpers: true }],
      },
    ],
  },
);

oxlintTestHarness.run(
  'monorepo-conventions/require-service-factory-context',
  requireServiceFactoryContextRule,
  {
    valid: [
      {
        code: 'export type ThingServiceContext = { readonly logger: Logger };',
        files: {
          '/repo/packages/services/thing/src/thing-service/create-thing-service.ts':
            'export const createThingService = (ctx: ThingServiceContext) => { const thingService = { createThing: (props: CreateThingProps) => createThing(ctx, props) }; return { thingService }; };',
        },
        filename: '/repo/packages/services/thing/src/thing-service/types.ts',
      },
      {
        code: 'export type ThingServiceContext = Readonly<Record<string, never>>;',
        files: {
          '/repo/packages/services/thing/src/thing-service/create-thing-service.ts':
            'export const createThingService = (ctx: ThingServiceContext) => { void ctx; const thingService = {}; return { thingService }; };',
        },
        filename: '/repo/packages/services/thing/src/thing-service/types.ts',
      },
      {
        code: 'import { createThing } from "./create-thing"; export const createThingService = (ctx: ThingServiceContext) => { const thingService = { createThing: (props: CreateThingProps) => createThing(ctx, props) }; return { thingService }; };',
        filename:
          '/repo/packages/services/thing/src/thing-service/create-thing-service.ts',
      },
      {
        code: 'export const createLLMProfilesService = (ctx: LLMProfilesServiceContext) => { const llmProfilesService = { readLLMProfile: (props: ReadLLMProfileProps) => readLLMProfile(ctx, props) }; const result = { llmProfilesService }; return result; };',
        filename:
          '/repo/packages/services/llm-profiles/src/llm-profiles-service/create-llm-profiles-service.ts',
      },
      {
        code: 'export const createProjectsService = (ctx: ProjectsServiceContext) => { const projectsService = { readProject: (props: ReadProjectProps) => readProject(ctx, props) }; const result = { projectsService }; return result; };',
        filename:
          '/repo/packages/services/projects/src/projects-service/create-projects-service.ts',
      },
      {
        code: 'export const create__skeletonService = (ctx: __SkeletonServiceContext) => { const __skeletonService = { info: () => info(ctx) }; const result = { __skeletonService }; return result; };',
        filename:
          '/repo/packages/services/__skeleton/src/__skeleton-service/create-__skeleton-service.ts',
      },
      {
        code: 'const { thingService } = createThingService({ logger });',
        filename: '/repo/packages/apps/app/src/services/create-services.ts',
      },
    ],
    invalid: [
      {
        code: 'export type ThingServiceContext = Readonly<Record<string, never>>;',
        errors: [{ messageId: 'requireNonEmptyServiceContext' }],
        files: {
          '/repo/packages/services/thing/src/thing-service/create-thing-service.ts':
            'export const createThingService = (ctx: ThingServiceContext) => { void ctx; const thingService = { createThing }; return { thingService }; };',
        },
        filename: '/repo/packages/services/thing/src/thing-service/types.ts',
      },
      {
        code: 'import { createThing } from "./create-thing"; export const createThingService = (ctx: ThingServiceContext) => { void ctx; const thingService = { createThing: createThing }; return { thingService }; };',
        errors: [
          { messageId: 'requireContextUse' },
          { messageId: 'requireServiceMethodWrapper' },
        ],
        filename:
          '/repo/packages/services/thing/src/thing-service/create-thing-service.ts',
      },
      {
        code: 'export const createThingService = (ctx: ThingServiceContext) => { const service = { createThing: (props: CreateThingProps) => createThing(ctx, props) }; const result = { service }; return result; };',
        errors: [{ messageId: 'requireServiceFactoryReturnName' }],
        filename:
          '/repo/packages/services/thing/src/thing-service/create-thing-service.ts',
      },
      {
        code: 'export const createThingService = (ctx: ThingServiceContext) => { const projectsService = { createThing: (props: CreateThingProps) => createThing(ctx, props) }; const result = { projectsService }; return result; };',
        errors: [{ messageId: 'requireServiceFactoryReturnName' }],
        filename:
          '/repo/packages/services/thing/src/thing-service/create-thing-service.ts',
      },
      {
        code: 'export const create__skeletonService = () => { const __skeletonService = { info: () => `__skeleton` }; const result = { __skeletonService }; return result; };',
        errors: [{ messageId: 'requireContextParameter' }],
        filename:
          '/repo/packages/services/__skeleton/src/__skeleton-service/create-__skeleton-service.ts',
      },
      {
        code: 'const { thingService } = createThingService({});',
        errors: [{ messageId: 'noEmptyServiceFactoryCall' }],
        filename: '/repo/packages/apps/app/src/services/create-services.ts',
      },
    ],
  },
);

oxlintTestHarness.run(
  'monorepo-conventions/require-service-info-method',
  requireServiceInfoMethodRule,
  {
    valid: [
      {
        code: 'export const createThingService = (ctx: ThingServiceContext) => { const thingService = { createThing: (props: CreateThingProps) => createThing(ctx, props), info: () => info(ctx) }; const result = { thingService }; return result; };',
        filename:
          '/repo/packages/services/thing/src/thing-service/create-thing-service.ts',
      },
      {
        code: 'export const create__skeletonService = (ctx: __SkeletonServiceContext) => { const __skeletonService = { info: () => info(ctx) }; const result = { __skeletonService }; return result; };',
        filename:
          '/repo/packages/services/__skeleton/src/__skeleton-service/create-__skeleton-service.ts',
      },
      {
        code: 'export const createThingService = (ctx: ThingServiceContext) => { void ctx; const thingService = {}; const result = { thingService }; return result; };',
        filename:
          '/repo/packages/services/thing/src/thing-service/create-thing-service.ts',
      },
      {
        code: 'export const createThingService = (ctx: ThingServiceContext) => { const thingService = { createThing: (props: CreateThingProps) => createThing(ctx, props) }; const result = { thingService }; return result; };',
        filename:
          '/repo/packages/apps/app/src/services/create-thing-service.ts',
      },
    ],
    invalid: [
      {
        code: 'export const createThingService = (ctx: ThingServiceContext) => { const thingService = { createThing: (props: CreateThingProps) => createThing(ctx, props) }; const result = { thingService }; return result; };',
        errors: [{ messageId: 'requireServiceInfoMethod' }],
        filename:
          '/repo/packages/services/thing/src/thing-service/create-thing-service.ts',
      },
    ],
  },
);

oxlintTestHarness.run(
  'monorepo-conventions/require-index-reexports',
  requireIndexReexportsRule,
  {
    valid: [
      {
        code: "export * from './create-thing';",
        filename: '/repo/packages/utils/thing/src/index.ts',
      },
      {
        code: "export { type Thing, createThing } from './create-thing';",
        filename: '/repo/packages/utils/thing/src/thing/index.ts',
      },
      {
        code: 'export const createThing = () => null;',
        filename: '/repo/packages/utils/thing/src/thing/create-thing.ts',
      },
    ],
    invalid: [
      {
        code: "import './styles.css';\nexport * from './button';",
        errors: [{ messageId: 'requireIndexReexport' }],
        filename: '/repo/packages/uis/core/src/index.ts',
      },
      {
        code: 'export const createThing = () => null;',
        errors: [{ messageId: 'requireIndexReexport' }],
        filename: '/repo/packages/utils/thing/src/index.ts',
      },
      {
        code: 'export type Thing = { readonly id: string };',
        errors: [{ messageId: 'requireIndexReexport' }],
        filename: '/repo/packages/utils/thing/src/index.ts',
      },
      {
        code: 'export { createThing };',
        errors: [{ messageId: 'requireIndexReexport' }],
        filename: '/repo/packages/utils/thing/src/index.ts',
      },
    ],
  },
);

oxlintTestHarness.run(
  'monorepo-conventions/require-cli-main-shebang',
  requireCliMainShebangRule,
  {
    valid: [
      {
        code: '#!/usr/bin/env bun\n\nconsole.log(`ready`);',
        filename: '/repo/packages/clis/utils/src/main.ts',
      },
      {
        code: 'console.log(`server`);',
        filename: '/repo/packages/apis/health/src/main.ts',
      },
      {
        code: 'console.log(`web`);',
        filename: '/repo/packages/apps/monorepo-home-web/src/main.tsx',
      },
      {
        code: 'console.log(`client`);',
        filename: '/repo/packages/apps/monorepo-client-web/src/main.ts',
      },
    ],
    invalid: [
      {
        code: 'console.log(`ready`);',
        errors: [{ messageId: 'requireCliMainShebang' }],
        filename: '/repo/packages/apps/monorepo-cli/src/main.ts',
        output: '#!/usr/bin/env bun\nconsole.log(`ready`);',
      },
      {
        code: '#!/usr/bin/env node\nconsole.log(`ready`);',
        errors: [{ messageId: 'requireCliMainShebang' }],
        filename: '/repo/packages/apps/monorepo-cli-tool/src/main.ts',
        output: '#!/usr/bin/env bun\nconsole.log(`ready`);',
      },
    ],
  },
);

oxlintTestHarness.run(
  'monorepo-conventions/require-shallow-src-structure',
  requireShallowSrcStructureRule,
  {
    valid: [
      {
        code: 'export * from "./thing";',
        filename: '/repo/packages/utils/thing/src/index.ts',
      },
      {
        code: 'export const main = () => null;',
        filename: '/repo/packages/clis/thing/src/main.ts',
      },
      {
        code: 'export const createThing = () => null;',
        filename: '/repo/packages/utils/thing/src/thing/create-thing.ts',
      },
      {
        code: 'export const ThingCard = () => <div />;',
        filename: '/repo/packages/uis/thing/src/thing/ThingCard.tsx',
      },
      {
        code: 'export const createThing = () => null;',
        filename: '/repo/packages/utils/thing/src/thing/create-thing.test.ts',
      },
      {
        code: 'export const create__skeleton = () => null;',
        filename:
          '/repo/packages/utils/__skeleton/src/__skeleton/create-__skeleton.ts',
      },
    ],
    invalid: [
      {
        code: 'export const createThing = () => null;',
        errors: [{ messageId: 'requireFeatureFolder' }],
        filename: '/repo/packages/utils/thing/src/create-thing.ts',
      },
      {
        code: 'export const createThing = () => null;',
        errors: [{ messageId: 'requireShallowSrcStructure' }],
        filename:
          '/repo/packages/utils/thing/src/features/users/create-thing.ts',
      },
      {
        code: 'export const createThing = () => null;',
        errors: [{ messageId: 'requireKebabFolderName' }],
        filename: '/repo/packages/utils/thing/src/Thing/create-thing.ts',
      },
      {
        code: 'export const createThing = () => null;',
        errors: [{ messageId: 'requireKebabFileName' }],
        filename: '/repo/packages/utils/thing/src/thing/createThing.ts',
      },
    ],
  },
);

oxlintTestHarness.run(
  'monorepo-conventions/require-public-export-filename',
  requirePublicExportFilenameRule,
  {
    valid: [
      {
        code: 'export const createThing = () => null;',
        filename: '/repo/packages/utils/thing/src/thing/create-thing.ts',
      },
      {
        code: 'export const HealthStatus = () => <div />;',
        filename: '/repo/packages/uis/thing/src/health/HealthStatus.tsx',
      },
      {
        code: 'export type Thing = { readonly id: string };\nexport const createThing = () => null;',
        filename: '/repo/packages/utils/thing/src/thing/create-thing.ts',
      },
      {
        code: 'export const checkIsThing = (value: unknown): value is Thing => true;',
        filename: '/repo/packages/utils/thing/src/thing/check-is-thing.ts',
      },
      {
        code: 'export const THING = `thing`;\nexport const OTHER_THING = `other-thing`;',
        filename: '/repo/packages/utils/thing/src/thing/constants.ts',
      },
      {
        code: 'export const createHTTPJSONHeaders = () => null;',
        filename:
          '/repo/packages/utils/http/src/headers/create-http-json-headers.ts',
      },
      {
        code: 'export const createSSEParseTransformStream = () => null;',
        filename:
          '/repo/packages/utils/sse/src/sse/create-sse-parse-transform-stream.ts',
      },
      {
        code: 'export const create__skeleton = () => null;',
        filename:
          '/repo/packages/utils/__skeleton/src/__skeleton/create-__skeleton.ts',
      },
    ],
    invalid: [
      {
        code: 'export const createThing = () => null;\nexport const updateThing = () => null;',
        errors: [{ messageId: 'requireSingleRuntimeExport' }],
        filename: '/repo/packages/utils/thing/src/thing/create-thing.ts',
      },
      {
        code: 'const createThing = () => null;\nexport { createThing };',
        errors: [{ messageId: 'requireInlineRuntimeExport' }],
        filename: '/repo/packages/utils/thing/src/thing/create-thing.ts',
      },
      {
        code: 'export const createThing = () => null;',
        errors: [{ messageId: 'requireExportFilename' }],
        filename: '/repo/packages/utils/thing/src/thing/thing.ts',
      },
      {
        code: 'export const checkIsThing = (value: unknown): value is Thing => true;',
        errors: [{ messageId: 'requireCheckPredicateFilename' }],
        filename: '/repo/packages/utils/thing/src/thing/is-thing.ts',
      },
    ],
  },
);

oxlintTestHarness.run(
  'monorepo-conventions/prefer-public-entrypoint-imports',
  preferPublicEntrypointImportsRule,
  {
    valid: [
      {
        code: "import { createThing } from './create-thing';",
        filename: '/repo/packages/utils/thing/src/thing/update-thing.ts',
      },
      {
        code: "import { createEnv } from '../env';",
        filename: '/repo/packages/apis/thing/src/app/create-app.ts',
      },
      {
        code: "import { createEnv } from '../env/index.ts';",
        filename: '/repo/packages/apis/thing/src/app/create-app.ts',
      },
      {
        code: "import { createLogger } from '@jearle/util-logger';",
        filename: '/repo/packages/apis/thing/src/app/create-app.ts',
      },
      {
        code: "const loggerModulePromise = import('@jearle/util-logger');",
        filename: '/repo/packages/apis/thing/src/app/create-app.ts',
      },
      {
        code: "type LoggerModule = import('@jearle/util-logger');",
        filename: '/repo/packages/apis/thing/src/app/create-app.ts',
      },
      {
        code: "import { createTestDatabase } from '@jearle/lib-postgres/test';",
        filename:
          '/repo/packages/services/thing/src/thing/create-thing.test.ts',
      },
      {
        code: "import image from '../media/image.png';",
        filename: '/repo/packages/apps/thing/src/app/App.tsx',
      },
      {
        code: "import '../styles/button.css';",
        filename: '/repo/packages/apps/thing/src/app/App.tsx',
      },
    ],
    invalid: [
      {
        code: "import { createEnv } from '../env/create-env';",
        errors: [{ messageId: 'preferPublicEntrypointImport' }],
        filename: '/repo/packages/apis/thing/src/app/create-app.ts',
      },
      {
        code: "import { createLogger } from '@jearle/util-logger/src/logger/create-logger';",
        errors: [{ messageId: 'preferPublicEntrypointImport' }],
        filename: '/repo/packages/apis/thing/src/app/create-app.ts',
      },
      {
        code: "import { createLogger } from '@jearle/util-logger/logger/create-logger';",
        errors: [{ messageId: 'preferPublicEntrypointImport' }],
        filename: '/repo/packages/apis/thing/src/app/create-app.ts',
      },
      {
        code: "const loggerModulePromise = import('@jearle/util-logger/logger/create-logger');",
        errors: [{ messageId: 'preferPublicEntrypointImport' }],
        filename: '/repo/packages/apis/thing/src/app/create-app.ts',
      },
      {
        code: "type LoggerModule = import('@jearle/util-logger/logger/create-logger');",
        errors: [{ messageId: 'preferPublicEntrypointImport' }],
        filename: '/repo/packages/apis/thing/src/app/create-app.ts',
      },
      {
        code: "import { createSharedThing } from '../../other/src/thing/create-shared-thing';",
        errors: [{ messageId: 'preferPublicEntrypointImport' }],
        filename: '/repo/packages/apis/thing/src/app/create-app.ts',
      },
    ],
  },
);
