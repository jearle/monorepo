// Canonical workflow/behavior verb prefixes shared by the rules that classify a
// runtime export or import as service workflow behavior rather than a schema
// contract or service surface:
//
// - no-schema-package-behavior-exports
// - require-service-factory-context
// - no-external-service-workflow-imports
//
// Keep this list as the single source of truth so the three rules stay aligned.
export const WORKFLOW_BEHAVIOR_VERBS = [
  `build`,
  `create`,
  `destroy`,
  `extract`,
  `normalize`,
  `package`,
  `parse`,
  `read`,
  `score`,
  `transform`,
  `update`,
  `validate`,
];

export const workflowBehaviorVerbNamePattern = new RegExp(
  `^(?:${WORKFLOW_BEHAVIOR_VERBS.join(`|`)})[A-Z]`,
  `u`,
);
