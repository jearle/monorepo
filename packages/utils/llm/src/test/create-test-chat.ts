import { createOpenrouterChat } from '../openrouter-chat';

import { createEnv } from '../env';

export const createTestChat = () => {
  const { env } = createEnv();
  const { OPENROUTER_API, OPENROUTER_API_KEY, OPENROUTER_MODEL } = env;

  const { chat } = createOpenrouterChat({
    api: OPENROUTER_API,
    apiKey: OPENROUTER_API_KEY,
    model: OPENROUTER_MODEL,
  });

  const result = { chat };

  return result;
};
