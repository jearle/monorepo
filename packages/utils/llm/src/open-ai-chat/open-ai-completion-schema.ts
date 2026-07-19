import { z } from 'zod';

const PromptTokensDetailsSchema = z.object({
  cached_tokens: z.number().optional(),
  cache_write_tokens: z.number().optional(),
  audio_tokens: z.number().optional(),
  video_tokens: z.number().optional(),
});

const CompletionTokensDetailsSchema = z.object({
  reasoning_tokens: z.number().optional(),
  audio_tokens: z.number().optional(),
  image_tokens: z.number().optional(),
});

const UsageSchema = z.object({
  prompt_tokens: z.number(),
  completion_tokens: z.number(),
  total_tokens: z.number(),
  prompt_tokens_details: PromptTokensDetailsSchema.optional(),
  completion_tokens_details: CompletionTokensDetailsSchema.optional(),
});

const FunctionSchema = z.object({
  name: z.string(),
  arguments: z.string(),
});

const ToolCallSchema = z.object({
  id: z.string(),
  type: z.string(),
  function: FunctionSchema,
});

const MessageSchema = z.object({
  role: z.string(),
  content: z.string().nullable(),
  refusal: z.unknown().optional(),
  reasoning: z.unknown().optional(),
  tool_calls: z.array(ToolCallSchema).optional(),
});

const ChoiceSchema = z.object({
  logprobs: z.unknown().nullable().optional(),
  finish_reason: z.string().nullable().optional(),
  native_finish_reason: z.string().nullable().optional(),
  index: z.number().optional(),
  message: MessageSchema,
  error: z
    .object({
      code: z.number(),
      message: z.string(),
      metadata: z.record(z.string(), z.unknown()).optional(),
    })
    .optional(),
});

export const OpenAICompletionSchema = z.object({
  id: z.string(),
  provider: z.string().optional(),
  model: z.string(),
  object: z.string(),
  created: z.number(),
  choices: z.array(ChoiceSchema),
  system_fingerprint: z.string().nullable().optional(),
  usage: UsageSchema.optional(),
});
