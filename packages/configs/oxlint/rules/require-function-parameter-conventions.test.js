import { createOxlintTestHarness } from './create-oxlint-test-harness.js';
import { requireFunctionParameterConventionsRule } from './require-function-parameter-conventions.js';

const oxlintTestHarness = createOxlintTestHarness();

oxlintTestHarness.run(
  'monorepo-conventions/require-function-parameter-conventions',
  requireFunctionParameterConventionsRule,
  {
    valid: [
      {
        code: 'const createThing = () => null;',
      },
      {
        code: 'const createThing = (props: CreateThingProps) => props;',
        options: [{ requireNamedPropsTypeReference: true }],
      },
      {
        code: 'export type ExtractThingProps = { readonly value: string }; export const extractThing = (props: ExtractThingProps) => props.value;',
      },
      {
        code: 'type ExtractThingProps = { readonly value: string }; const extractThing = (props: ExtractThingProps) => props.value;',
      },
      {
        code: 'const service = { createThing: (props: CreateThingProps) => props };',
        options: [{ requireNamedPropsTypeReference: true }],
      },
      {
        code: 'const createThing = (ctx: ThingContext) => ctx;',
      },
      {
        code: 'type CreateThingProps = { readonly contextId: string; readonly value: string }; const createThing = (ctx: ThingContext, props: CreateThingProps) => ({ ctx, props });',
      },
      {
        code: 'type CreateThingOptions = { readonly ctx?: ThingContext }; const createThing = (ctx: ThingContext, props: CreateThingProps, options: CreateThingOptions = {}) => ({ ctx, props, options });',
      },
      {
        code: 'type CreateThingProps = { readonly ctx: z.RefinementCtx; readonly value: string }; const createThing = (props: CreateThingProps) => props.value;',
      },
      {
        code: 'type CreateThingProps = { readonly nested: { readonly ctx: ThingContext }; readonly value: string }; const createThing = (props: CreateThingProps) => props.value;',
      },
      {
        code: 'type CreateThingInput = { readonly ctx: ThingContext; readonly value: string }; const createThing = (input: CreateThingInput) => input.value;',
      },
      {
        code: 'const checkIsThing = (value: unknown): value is Thing => true;',
      },
      {
        code: 'const extractThing = (props: SharedProps<string>) => props.value;',
        options: [{ requireNamedPropsTypeReference: true }],
      },
    ],
    invalid: [
      {
        code: 'const createThing = (_: unknown) => null;',
        errors: [{ messageId: 'requireNoPlaceholderParameter' }],
      },
      {
        code: 'const createThing = (input: CreateThingProps) => input;',
        errors: [{ messageId: 'requireParameterName' }],
      },
      {
        code: 'const createThing = (context: ThingContext) => context;',
        errors: [{ messageId: 'requireParameterName' }],
      },
      {
        code: 'const createThing = (props: ThingContext) => props;',
        options: [{ requireNamedPropsTypeReference: true }],
        errors: [
          { messageId: 'requirePropsTypeReference' },
          { messageId: 'requireParameterName' },
        ],
      },
      {
        code: 'const createThing = (options: CreateThingOptions, props: CreateThingProps) => ({ options, props });',
        errors: [{ messageId: 'requireParameterOrder' }],
      },
      {
        code: 'export const extractThing = (props: { readonly value: string }) => props.value;',
        options: [{ requireNamedPropsTypeReference: true }],
        errors: [{ messageId: 'requirePropsTypeReference' }],
      },
      {
        code: 'export const extractThing = (props: Readonly<{ readonly value: string }>) => props.value;',
        options: [{ requireNamedPropsTypeReference: true }],
        errors: [{ messageId: 'requirePropsTypeReference' }],
      },
      {
        code: 'export const extractThing = (props: Pick<Thing, `value`>) => props.value;',
        options: [{ requireNamedPropsTypeReference: true }],
        errors: [{ messageId: 'requirePropsTypeReference' }],
      },
      {
        code: 'export const extractThing = (props: Extract<Thing, { readonly value: string }>) => props.value;',
        options: [{ requireNamedPropsTypeReference: true }],
        errors: [{ messageId: 'requirePropsTypeReference' }],
      },
      {
        code: 'const extractThing = (props: { readonly value: string }) => props.value;',
        options: [{ requireNamedPropsTypeReference: true }],
        errors: [{ messageId: 'requirePropsTypeReference' }],
      },
      {
        code: 'const service = { createThing: (props: { readonly value: string }) => props.value };',
        options: [{ requireNamedPropsTypeReference: true }],
        errors: [{ messageId: 'requirePropsTypeReference' }],
      },
      {
        code: 'type CreateThingProps = { readonly ctx: ThingContext; readonly value: string }; const createThing = (props: CreateThingProps) => props.value;',
        errors: [{ messageId: 'requireNoCtxPropsProperty' }],
      },
      {
        code: 'export type CreateThingProps = { readonly ctx: ThingContext; readonly value: string }; export const createThing = (props: CreateThingProps) => props.value;',
        errors: [{ messageId: 'requireNoCtxPropsProperty' }],
      },
      {
        code: "type CreateThingProps = { readonly 'ctx': ThingContext; readonly value: string }; const createThing = (props: CreateThingProps) => props.value;",
        errors: [{ messageId: 'requireNoCtxPropsProperty' }],
      },
      {
        code: 'type CreateThingProps = { readonly [`ctx`]: ThingContext; readonly value: string }; const createThing = (props: CreateThingProps) => props.value;',
        errors: [{ messageId: 'requireNoCtxPropsProperty' }],
      },
    ],
  },
);
