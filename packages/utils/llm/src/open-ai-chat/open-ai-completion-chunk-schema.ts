import { z } from 'zod';

const DeltaSchema = z
  .object({
    content: z.string(),
    role: z.enum(['assistant', 'user', 'system']).optional(),
    function_call: z
      .object({
        name: z.string().optional(),
        arguments: z.string().optional(),
      })
      .optional(),
    tool_calls: z
      .array(
        z.object({
          id: z.string(),
          type: z.string(),
          function: z.object({
            name: z.string(),
            arguments: z.string(),
          }),
        }),
      )
      .optional(),
  })
  .catchall(z.unknown());

const LogprobsSchema = z
  .object({
    tokens: z.array(z.string()).optional(),
    token_logprobs: z.array(z.number()).optional(),
    top_logprobs: z.array(z.record(z.string(), z.number())).optional(),
  })
  .nullable();

const ChoiceSchema = z.object({
  index: z.number(),
  delta: DeltaSchema,
  finish_reason: z.string().nullable(),
  native_finish_reason: z.string().nullable(),
  logprobs: LogprobsSchema,
});

export const OpenAICompletionChunkSchema = z.object({
  id: z.string(),
  provider: z.string(),
  model: z.string(),
  object: z.string(),
  created: z.number(),
  choices: z.array(ChoiceSchema),
  system_fingerprint: z.string().nullable().optional(),
});
