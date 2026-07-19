const OPENROUTER_CHAT_COMPLETIONS_PATH = `/chat/completions`;
const OPENROUTER_EMBEDDINGS_PATH = `/embeddings`;

type CreateOpenrouterEmbeddingsAPIProps = {
  readonly api: string;
};

const createOpenrouterEmbeddingsAPI = (
  props: CreateOpenrouterEmbeddingsAPIProps,
) => {
  const { api } = props;

  const hasChatCompletionsPath = api.includes(OPENROUTER_CHAT_COMPLETIONS_PATH);

  if (hasChatCompletionsPath === false) {
    const result = api;

    return result;
  }

  const embeddingsAPI = api.replace(
    OPENROUTER_CHAT_COMPLETIONS_PATH,
    OPENROUTER_EMBEDDINGS_PATH,
  );
  const result = embeddingsAPI;

  return result;
};
export type FetchOpenrouterEmbeddingsProps = {
  readonly api: string;
  readonly apiKey: string;
  readonly model: string;
  readonly texts: readonly string[];
};

/**
 * Sends an embeddings request to the OpenRouter embeddings endpoint.
 *
 * @param props - The OpenRouter embeddings request parameters.
 * @returns A fetch response wrapper for downstream parsing.
 *
 * @example
 * const { response } = await fetchOpenrouterEmbeddings({
 *   api: `https://openrouter.ai/api/v1/chat/completions`,
 *   apiKey: `test-key`,
 *   model: `openai/text-embedding-3-small`,
 *   texts: [`hello`],
 * });
 */
export const fetchOpenrouterEmbeddings = async (
  props: FetchOpenrouterEmbeddingsProps,
) => {
  const { api, apiKey, model, texts } = props;

  const method = `POST`;
  const headers = {
    [`Authorization`]: `Bearer ${apiKey}`,
    [`Content-Type`]: `application/json`,
  };

  const bodyJSON = {
    model,
    input: texts,
  };

  const body = JSON.stringify(bodyJSON);
  const embeddingsAPI = createOpenrouterEmbeddingsAPI({ api });

  const response = await fetch(embeddingsAPI, {
    method,
    headers,
    body,
  });

  const result = { response };

  return result;
};
