import { z } from 'zod';

const PromptTokensDetailsSchema = z.object({
  cached_tokens: z.number(),
  audio_tokens: z.number(),
});

const CompletionTokensDetailsSchema = z.object({
  reasoning_tokens: z.number(),
});

const UsageSchema = z.object({
  prompt_tokens: z.number(),
  completion_tokens: z.number(),
  total_tokens: z.number(),
  prompt_tokens_details: PromptTokensDetailsSchema,
  completion_tokens_details: CompletionTokensDetailsSchema,
});

const MessageSchema = z.object({
  role: z.string(),
  content: z.string(),
  refusal: z.null(),
  reasoning: z.null(),
});

const ChoiceSchema = z.object({
  logprobs: z.null(),
  finish_reason: z.string(),
  native_finish_reason: z.string(),
  index: z.number(),
  message: MessageSchema,
});

export const OpenAICompletionSchema = z.object({
  id: z.string(),
  provider: z.string(),
  model: z.string(),
  object: z.string(),
  created: z.number(),
  choices: z.array(ChoiceSchema),
  system_fingerprint: z.null(),
  usage: UsageSchema,
});
