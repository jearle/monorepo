import { createOxlintTestHarness } from './create-oxlint-test-harness.js';
import { requireResultVariableReturnRule } from './require-result-variable-return.js';

const oxlintTestHarness = createOxlintTestHarness();

oxlintTestHarness.run(
  'monorepo-conventions/require-result-variable-return',
  requireResultVariableReturnRule,
  {
    valid: [
      {
        code: 'const createCount = () => { return count; };',
      },
      {
        code: 'const createSummary = () => { return { count: values.length }; };',
      },
      {
        code: 'const createSummary = () => { return createComputedSummary(values); };',
      },
      ...[
        'const createValue = () => { return value; };',
        'const createValue = () => { return value.current; };',
        'const createValue = () => { return values[index]; };',
        'const createValue = () => { return true; };',
        'const createValue = () => { return 1; };',
        'const createValue = () => { return 1n; };',
        'const createValue = () => { return null; };',
        'const createValue = () => { return undefined; };',
        'const createValue = () => { return `value`; };',
      ].map((code) => ({
        code,
        options: [{ requireAllNonTrivialReturns: true }],
      })),
      {
        code:
          'const createSummary = () => {\n' +
          '  const result = createResultSuccess({ data });\n' +
          '  return result;\n' +
          '};',
      },
      {
        code:
          'const createSummary = () => {\n' +
          '  const result = {\n' +
          '    nearestNeighborMax: computeMax(sims),\n' +
          '    meanSimilarity: mean(sims),\n' +
          '    topPairs: pickTopPairs(sims),\n' +
          '  };\n' +
          '  return result;\n' +
          '};',
      },
      {
        code:
          'const createSummary = () => {\n' +
          '  const similaritySummary = {\n' +
          '    nearestNeighborMax: computeMax(sims),\n' +
          '    meanSimilarity: mean(sims),\n' +
          '  };\n' +
          '  return similaritySummary;\n' +
          '};',
      },
      {
        code: 'const createSummary = () => { return { count, total }; };',
      },
      {
        code:
          'const createSummary = () => {\n' +
          '  // oxlint-disable-next-line monorepo-conventions/require-result-variable-return -- Kept inline to mirror the external response fixture exactly.\n' +
          '  return {\n' +
          '    nearestNeighborMax: computeMax(sims),\n' +
          '    meanSimilarity: mean(sims),\n' +
          '  };\n' +
          '};',
      },
    ],
    invalid: [
      ...[
        'const createValue = () => { return []; };',
        'const createValue = () => { return {}; };',
        'const createValue = () => { return createOther(); };',
        'const createValue = () => { return new Value(); };',
        'const createValue = async () => { return await createOther(); };',
        'const createValue = () => { return `value-${id}`; };',
        'const createValue = () => { return !value; };',
        'const createValue = () => { return value + other; };',
        'const createValue = () => { return value && other; };',
        'const createValue = () => { return value ? first : second; };',
        'const createValue = () => { return (first, second); };',
        'const createValue = () => { return tag`value`; };',
        'const createValue = () => { return (value = other); };',
        'const createValue = () => { return value++; };',
        'function* createValue() { return yield value; }',
        'const createValue = () => { return () => value; };',
        'const createValue = () => { return function () {}; };',
        'const createValue = () => { return value as Value; };',
        'const createValue = () => { return /value/u; };',
        'const createValue = () => { return createOther().value; };',
        'const createValue = () => { return values[index + 1]; };',
      ].map((code) => ({
        code,
        options: [{ requireAllNonTrivialReturns: true }],
        errors: [{ messageId: `requireNonTrivialVariableReturn` }],
      })),
      ...[
        `createResultError({ error })`,
        `createResultSuccess({ data })`,
        `wrapResultError({ error })`,
      ].map((expression) => ({
        code: `const createSummary = () => { return ${expression}; };`,
        errors: [{ messageId: `requireResultHelperVariableReturn` }],
      })),
      {
        code:
          'const createSummary = () => {\n' +
          '  return {\n' +
          '    nearestNeighborMax: computeMax(sims),\n' +
          '    meanSimilarity: mean(sims),\n' +
          '    topPairs: pickTopPairs(sims),\n' +
          '  };\n' +
          '};',
        errors: [{ messageId: 'requireResultVariableReturn' }],
      },
      {
        code:
          'const createSummary = () => {\n' +
          '  return {\n' +
          '    nearestNeighborMax: computeMax(sims),\n' +
          '    meanSimilarity: mean(sims),\n' +
          '  } as Summary;\n' +
          '};',
        errors: [{ messageId: 'requireResultVariableReturnCast' }],
      },
      {
        code:
          'const createSummary = () => {\n' +
          '  return { count, total } satisfies Summary;\n' +
          '};',
        errors: [{ messageId: 'requireResultVariableReturnCast' }],
      },
      {
        code:
          'const createSummary = () => {\n' +
          '  return (() => ({\n' +
          '    nearestNeighborMax: computeMax(sims),\n' +
          '    meanSimilarity: mean(sims),\n' +
          '  }))();\n' +
          '};',
        errors: [{ messageId: 'requireResultVariableReturnIife' }],
      },
      {
        code:
          'const createSummary = () => {\n' +
          '  return (() => {\n' +
          '    const nearestNeighborMax = computeMax(sims);\n' +
          '    return {\n' +
          '      nearestNeighborMax,\n' +
          '      meanSimilarity: mean(sims),\n' +
          '    };\n' +
          '  })();\n' +
          '};',
        errors: [{ messageId: 'requireResultVariableReturnIife' }],
      },
      {
        code: 'const createCount = () => { return (() => count)(); };',
        errors: [{ messageId: 'requireResultVariableReturnIife' }],
      },
      {
        code:
          'const createValues = () => {\n' +
          '  return (function* () { yield value; })();\n' +
          '};',
        errors: [{ messageId: 'requireResultVariableReturnIife' }],
      },
    ],
  },
);
