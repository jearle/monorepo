import { z } from 'zod';

export const EmbeddingsInputSchema = z.object({ texts: z.array(z.string()) });

export type EmbeddingsInput = Readonly<z.infer<typeof EmbeddingsInputSchema>>;
