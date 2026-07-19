import { noObjectMutationRule } from './rules/no-object-mutation.js';
import { noDefaultExportsRule } from './rules/no-default-exports.js';
import { noDirectProcessEnvRule } from './rules/no-direct-process-env.js';
import { noDuplicateCaptureCliHelpersRule } from './rules/no-duplicate-capture-cli-helpers.js';
import { noExternalServiceWorkflowImportsRule } from './rules/no-external-service-workflow-imports.js';
import { noInlineAnsiEscapesRule } from './rules/no-inline-ansi-escapes.js';
import { noInternalModuleMocksRule } from './rules/no-internal-module-mocks.js';
import { noNestedObjectTypeLiteralsRule } from './rules/no-nested-object-type-literals.js';
import { noNestedTernariesRule } from './rules/no-nested-ternaries.js';
import { noNullCompanionResultFieldsRule } from './rules/no-null-companion-result-fields.js';
import { noProcessExitCodeAssignmentRule } from './rules/no-process-exit-code-assignment.js';
import { noProcessEnvCastsRule } from './rules/no-process-env-casts.js';
import { noRedundantLocalDomainPrefixRule } from './rules/no-redundant-local-domain-prefix.js';
import { noDeprecatedZodApisRule } from './rules/no-deprecated-zod-apis.js';
import { noSchemaPackageBehaviorExportsRule } from './rules/no-schema-package-behavior-exports.js';
import { noThrownBoundaryValidationErrorsRule } from './rules/no-thrown-boundary-validation-errors.js';
import { orderImportSpecifiersRule } from './rules/order-import-specifiers.js';
import { preferArrayHeadDestructuringRule } from './rules/prefer-array-head-destructuring.js';
import { preferBacktickStringLiteralsRule } from './rules/prefer-backtick-string-literals.js';
import { preferBoundarySafeParseRule } from './rules/prefer-boundary-safe-parse.js';
import { preferCheckPredicateNamesRule } from './rules/prefer-check-predicate-names.js';
import { preferConstantsOverEnumsRule } from './rules/prefer-constants-over-enums.js';
import { preferDirectoryIndexSourceImportsRule } from './rules/prefer-directory-index-source-imports.js';
import { preferExtensionlessRelativeSourceImportsRule } from './rules/prefer-extensionless-relative-source-imports.js';
import { preferExportedConstArrowFunctionsRule } from './rules/prefer-exported-const-arrow-functions.js';
import { preferFunctionOwnedHelperTypeNamesRule } from './rules/prefer-function-owned-helper-type-names.js';
import { preferInlineTypeExportsRule } from './rules/prefer-inline-type-exports.js';
import { preferInlineTypeImportsRule } from './rules/prefer-inline-type-imports.js';
import { preferPublicEntrypointImportsRule } from './rules/prefer-public-entrypoint-imports.js';
import { preferReadonlyArraySyntaxRule } from './rules/prefer-readonly-array-syntax.js';
import { preferSchemaDerivedTypesRule } from './rules/prefer-schema-derived-types.js';
import { preferTestPublicEntrypointImportsRule } from './rules/prefer-test-public-entrypoint-imports.js';
import { preferTypeAliasesRule } from './rules/prefer-type-aliases.js';
import { requireCliMainShebangRule } from './rules/require-cli-main-shebang.js';
import { requireFunctionParameterConventionsRule } from './rules/require-function-parameter-conventions.js';
import { requireErrorMessageHelpersInErrorModulesRule } from './rules/require-error-message-helpers-in-error-modules.js';
import { requireHelperTypePlacementRule } from './rules/require-helper-type-placement.js';
import { requireIndexReexportsRule } from './rules/require-index-reexports.js';
import { requireJotaiHookResultObjectRule } from './rules/require-jotai-hook-result-object.js';
import { requireLocalSchemaFileNamesRule } from './rules/require-local-schema-file-names.js';
import { requireOptionsTypeSuffixRule } from './rules/require-options-type-suffix.js';
import { requirePublicExportFilenameRule } from './rules/require-public-export-filename.js';
import { requirePublicTypeReferenceExportsRule } from './rules/require-public-type-reference-exports.js';
import { requireReadonlyTypePropertiesRule } from './rules/require-readonly-type-properties.js';
import { requireResultVariableReturnRule } from './rules/require-result-variable-return.js';
import { requireServiceFactoryContextRule } from './rules/require-service-factory-context.js';
import { requireServiceInfoMethodRule } from './rules/require-service-info-method.js';
import { requireShallowSrcStructureRule } from './rules/require-shallow-src-structure.js';
import { requireTsExpectErrorDescriptionRule } from './rules/require-ts-expect-error-description.js';
import { requireUiComponentExamplesRule } from './rules/require-ui-component-examples.js';
import { requireUppercaseStatusValuesRule } from './rules/require-uppercase-status-values.js';

export const monorepoConventionsPlugin = {
  meta: {
    name: `monorepo-conventions`,
  },
  rules: {
    [`no-default-exports`]: noDefaultExportsRule,
    [`no-deprecated-zod-apis`]: noDeprecatedZodApisRule,
    [`no-direct-process-env`]: noDirectProcessEnvRule,
    [`no-duplicate-capture-cli-helpers`]: noDuplicateCaptureCliHelpersRule,
    [`no-external-service-workflow-imports`]:
      noExternalServiceWorkflowImportsRule,
    [`no-inline-ansi-escapes`]: noInlineAnsiEscapesRule,
    [`no-internal-module-mocks`]: noInternalModuleMocksRule,
    [`no-nested-object-type-literals`]: noNestedObjectTypeLiteralsRule,
    [`no-nested-ternaries`]: noNestedTernariesRule,
    [`no-null-companion-result-fields`]: noNullCompanionResultFieldsRule,
    [`no-object-mutation`]: noObjectMutationRule,
    [`no-process-exit-code-assignment`]: noProcessExitCodeAssignmentRule,
    [`no-process-env-casts`]: noProcessEnvCastsRule,
    [`no-redundant-local-domain-prefix`]: noRedundantLocalDomainPrefixRule,
    [`no-schema-package-behavior-exports`]: noSchemaPackageBehaviorExportsRule,
    [`no-thrown-boundary-validation-errors`]:
      noThrownBoundaryValidationErrorsRule,
    [`order-import-specifiers`]: orderImportSpecifiersRule,
    [`prefer-array-head-destructuring`]: preferArrayHeadDestructuringRule,
    [`prefer-backtick-string-literals`]: preferBacktickStringLiteralsRule,
    [`prefer-boundary-safe-parse`]: preferBoundarySafeParseRule,
    [`prefer-check-predicate-names`]: preferCheckPredicateNamesRule,
    [`prefer-constants-over-enums`]: preferConstantsOverEnumsRule,
    [`prefer-directory-index-source-imports`]:
      preferDirectoryIndexSourceImportsRule,
    [`prefer-extensionless-relative-source-imports`]:
      preferExtensionlessRelativeSourceImportsRule,
    [`prefer-exported-const-arrow-functions`]:
      preferExportedConstArrowFunctionsRule,
    [`prefer-function-owned-helper-type-names`]:
      preferFunctionOwnedHelperTypeNamesRule,
    [`prefer-inline-type-exports`]: preferInlineTypeExportsRule,
    [`prefer-inline-type-imports`]: preferInlineTypeImportsRule,
    [`prefer-public-entrypoint-imports`]: preferPublicEntrypointImportsRule,
    [`prefer-readonly-array-syntax`]: preferReadonlyArraySyntaxRule,
    [`prefer-schema-derived-types`]: preferSchemaDerivedTypesRule,
    [`prefer-test-public-entrypoint-imports`]:
      preferTestPublicEntrypointImportsRule,
    [`prefer-type-aliases`]: preferTypeAliasesRule,
    [`require-cli-main-shebang`]: requireCliMainShebangRule,
    [`require-function-parameter-conventions`]:
      requireFunctionParameterConventionsRule,
    [`require-error-message-helpers-in-error-modules`]:
      requireErrorMessageHelpersInErrorModulesRule,
    [`require-helper-type-placement`]: requireHelperTypePlacementRule,
    [`require-index-reexports`]: requireIndexReexportsRule,
    [`require-jotai-hook-result-object`]: requireJotaiHookResultObjectRule,
    [`require-local-schema-file-names`]: requireLocalSchemaFileNamesRule,
    [`require-options-type-suffix`]: requireOptionsTypeSuffixRule,
    [`require-public-export-filename`]: requirePublicExportFilenameRule,
    [`require-public-type-reference-exports`]:
      requirePublicTypeReferenceExportsRule,
    [`require-readonly-type-properties`]: requireReadonlyTypePropertiesRule,
    [`require-result-variable-return`]: requireResultVariableReturnRule,
    [`require-service-factory-context`]: requireServiceFactoryContextRule,
    [`require-service-info-method`]: requireServiceInfoMethodRule,
    [`require-shallow-src-structure`]: requireShallowSrcStructureRule,
    [`require-ts-expect-error-description`]:
      requireTsExpectErrorDescriptionRule,
    [`require-ui-component-examples`]: requireUiComponentExamplesRule,
    [`require-uppercase-status-values`]: requireUppercaseStatusValuesRule,
  },
};

export default monorepoConventionsPlugin;
