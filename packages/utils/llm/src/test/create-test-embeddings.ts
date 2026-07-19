import { createOpenrouterEmbeddings } from '../openrouter-embeddings';
import { createEnv } from '../env';

/**
 * Creates a test embeddings client from the typed env factory.
 *
 * @returns A test embeddings client.
 *
 * @example
 * const { embeddings } = createTestEmbeddings();
 */
export const createTestEmbeddings = () => {
  const { env } = createEnv();
  const { OPENROUTER_API, OPENROUTER_API_KEY, OPENROUTER_EMBEDDINGS_MODEL } =
    env;

  const { embeddings } = createOpenrouterEmbeddings({
    api: OPENROUTER_API,
    apiKey: OPENROUTER_API_KEY,
    model: OPENROUTER_EMBEDDINGS_MODEL,
  });

  const result = { embeddings };

  return result;
};
