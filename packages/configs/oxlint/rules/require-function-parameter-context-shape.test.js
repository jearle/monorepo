import { createOxlintTestHarness } from './create-oxlint-test-harness.js';
import { requireFunctionParameterConventionsRule } from './require-function-parameter-conventions.js';

const oxlintTestHarness = createOxlintTestHarness();

oxlintTestHarness.run(
  'monorepo-conventions/require-function-parameter-conventions',
  requireFunctionParameterConventionsRule,
  {
    valid: [
      {
        code: 'const createThing = (ctx: ThingContext, props: CreateThingProps, options: CreateThingOptions = {}) => ({ ctx, props, options });',
        options: [
          {
            requireContextOperationShape: true,
            requireNamedPropsTypeReference: true,
          },
        ],
      },
      {
        code: 'schema.superRefine((value: Thing, ctx: z.RefinementCtx) => ({ value, ctx }));',
        options: [{ requireContextOperationShape: true }],
      },
      {
        code: 'const createThings = (contexts: readonly ThingContext[]) => contexts; const createKey = (contextKey: keyof ThingContext) => contextKey;',
        options: [{ requireContextOperationShape: true }],
      },
    ],
    invalid: [
      {
        code: 'const createThing = (ctx: ThingContext, value: string) => ({ ctx, value });',
        options: [{ requireContextOperationShape: true }],
        errors: [{ messageId: 'requireContextOperationParameter' }],
      },
      {
        code: 'const createThing = (ctx: unknown, value: string) => ({ ctx, value });',
        options: [{ requireContextOperationShape: true }],
        errors: [{ messageId: 'requireContextOperationParameter' }],
      },
      {
        code: 'const createThing = (ctx: GenericCtx, value: string) => ({ ctx, value });',
        options: [{ requireContextOperationShape: true }],
        errors: [{ messageId: 'requireContextOperationParameter' }],
      },
      {
        code: 'const createThing = (value: string, ctx: ThingContext) => ({ ctx, value });',
        options: [{ requireContextOperationShape: true }],
        errors: [{ messageId: 'requireContextFirstParameter' }],
      },
      {
        code: 'const createThing = (value: string, ctx: Namespace.ThingContext) => ({ ctx, value });',
        options: [{ requireContextOperationShape: true }],
        errors: [{ messageId: 'requireContextFirstParameter' }],
      },
      {
        code: 'const refineThing = (value: Thing, ctx: z.RefinementCtx) => ({ value, ctx });',
        options: [{ requireContextOperationShape: true }],
        errors: [{ messageId: 'requireContextFirstParameter' }],
      },
      {
        code: 'const createThing = (ctx: ThingContext, props: CreateThingProps, value: string) => ({ ctx, props, value });',
        options: [{ requireContextOperationShape: true }],
        errors: [{ messageId: 'requireContextOperationParameter' }],
      },
      {
        code: 'const createThing = ({ logger }: ThingContext) => logger;',
        options: [{ requireContextOperationShape: true }],
        errors: [{ messageId: 'requireDirectContextParameter' }],
      },
      {
        code: 'const createThing = ({ logger }: ThingContext, value: string) => ({ logger, value });',
        options: [{ requireContextOperationShape: true }],
        errors: [
          { messageId: 'requireDirectContextParameter' },
          { messageId: 'requireContextOperationParameter' },
        ],
      },
      {
        code: 'type ThingContext = readonly unknown[]; const createThing = (...contexts: ThingContext) => contexts;',
        options: [{ requireContextOperationShape: true }],
        errors: [{ messageId: 'requireDirectContextParameter' }],
      },
      {
        code: 'const createThing = (value: string, { logger }: ThingContext) => ({ logger, value });',
        options: [{ requireContextOperationShape: true }],
        errors: [
          { messageId: 'requireDirectContextParameter' },
          { messageId: 'requireContextFirstParameter' },
        ],
      },
      {
        code: 'const createThing = ({ logger }: ThingContext = thingContext, value: string) => ({ logger, value });',
        options: [{ requireContextOperationShape: true }],
        errors: [
          { messageId: 'requireDirectContextParameter' },
          { messageId: 'requireContextOperationParameter' },
        ],
      },
      {
        code: 'type ThingContext = readonly unknown[]; const createThing = (value: string, ...contexts: ThingContext) => ({ contexts, value });',
        options: [{ requireContextOperationShape: true }],
        errors: [
          { messageId: 'requireDirectContextParameter' },
          { messageId: 'requireContextFirstParameter' },
        ],
      },
      {
        code: 'const createThing = (ctx: ThingContext, { value }: CreateThingProps) => ({ ctx, value });',
        options: [{ requireContextOperationShape: true }],
        errors: [{ messageId: 'requireContextOperationParameter' }],
      },
      {
        code: 'type CreateThingOptions = readonly unknown[]; const createThing = (ctx: ThingContext, ...options: CreateThingOptions) => ({ ctx, options });',
        options: [{ requireContextOperationShape: true }],
        errors: [{ messageId: 'requireContextOperationParameter' }],
      },
    ],
  },
);
