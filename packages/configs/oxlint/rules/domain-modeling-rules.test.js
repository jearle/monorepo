import { noRedundantLocalDomainPrefixRule } from './no-redundant-local-domain-prefix.js';
import { createOxlintTestHarness } from './create-oxlint-test-harness.js';

const oxlintTestHarness = createOxlintTestHarness();

oxlintTestHarness.run(
  'monorepo-conventions/no-redundant-local-domain-prefix',
  noRedundantLocalDomainPrefixRule,
  {
    valid: [
      {
        code: 'export const GenerationConfigSchema = z.object({ key: z.string() });',
        filename:
          '/repo/packages/schemas/behavior-datasets/src/behavior-datasets/generation-config-schemas.ts',
      },
      {
        code: 'export type CandidateMetadata = { readonly key: string };',
        filename:
          '/repo/packages/schemas/behavior-datasets/src/behavior-datasets/candidate-metadata-schemas.ts',
      },
      {
        code: 'export const createBehaviorDatasetsService = () => ({}); export type BehaviorDatasetsService = {}; export type BehaviorDatasetsServiceContext = {}; export type BehaviorDatasetsServiceError = {};',
        filename:
          '/repo/packages/services/behavior-datasets/src/behavior-datasets-service/create-behavior-datasets-service.ts',
      },
      {
        code: 'export const BEHAVIOR_DATASET_ERROR_CODE = `ERROR`;',
        filename:
          '/repo/packages/services/behavior-datasets/src/row-validation/errors.ts',
      },
      {
        code: 'export const BehaviorDatasetUserSchema = z.object({ id: z.string() });',
        filename: '/repo/packages/schemas/user/src/user/user-schemas.ts',
      },
    ],
    invalid: [
      {
        code: 'export const BehaviorDatasetGenerationConfigSchema = z.object({ key: z.string() });',
        errors: [{ messageId: 'noRedundantLocalDomainPrefix' }],
        filename:
          '/repo/packages/schemas/behavior-datasets/src/behavior-datasets/generation-config-schemas.ts',
      },
      {
        code: 'export type BehaviorDatasetCandidateMetadata = { readonly key: string };',
        errors: [{ messageId: 'noRedundantLocalDomainPrefix' }],
        filename:
          '/repo/packages/schemas/behavior-datasets/src/behavior-datasets/candidate-metadata-schemas.ts',
      },
      {
        code: 'const renderScenarioStyleInstructions = () => null; export { renderScenarioStyleInstructions as renderBehaviorDatasetScenarioStyleInstructions };',
        errors: [{ messageId: 'noRedundantLocalDomainPrefix' }],
        filename:
          '/repo/packages/services/behavior-datasets/src/scenario-style-instructions/render-scenario-style-instructions.ts',
      },
      {
        code: 'export function renderBehaviorDatasetScenarioStyleInstructions() { return null; }',
        errors: [{ messageId: 'noRedundantLocalDomainPrefix' }],
        filename:
          '/repo/packages/services/behavior-datasets/src/scenario-style-instructions/render-scenario-style-instructions.ts',
      },
      {
        code: 'export interface BehaviorDatasetScenario { readonly key: string }',
        errors: [{ messageId: 'noRedundantLocalDomainPrefix' }],
        filename:
          '/repo/packages/schemas/behavior-datasets/src/behavior-datasets/scenario-schemas.ts',
      },
      {
        code: 'export const { BehaviorDatasetCandidateMetadata } = source;',
        errors: [{ messageId: 'noRedundantLocalDomainPrefix' }],
        filename:
          '/repo/packages/schemas/behavior-datasets/src/behavior-datasets/candidate-metadata-schemas.ts',
      },
    ],
  },
);
