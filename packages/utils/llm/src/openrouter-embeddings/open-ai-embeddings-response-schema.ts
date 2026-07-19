import { z } from 'zod';

export const OpenAIEmbeddingsResponseSchema = z.object({
  data: z.array(
    z.object({
      embedding: z.array(z.number()),
      index: z.number(),
    }),
  ),
  model: z.string(),
  usage: z
    .object({
      prompt_tokens: z.number(),
      total_tokens: z.number(),
    })
    .optional(),
});
