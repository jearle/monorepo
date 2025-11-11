import { fetch } from 'bun';

type PropsFetchChatCompletions = {
  readonly api: string;
  readonly apiKey: string;
  readonly model: string;
  readonly system: string;
  readonly user: string;
  readonly stream: boolean;
};
export const fetchOpenrouterChatCompletions = async (
  props: PropsFetchChatCompletions,
) => {
  const { api, apiKey, model, system, user, stream } = props;

  const method = `POST`;
  const headers = {
    [`Authorization`]: `Bearer ${apiKey}`,
    [`Content-Type`]: `application/json`,
  };

  const systemMessage = { role: `system`, content: system };
  const userMessage = { role: `user`, content: user };

  const messages = [systemMessage, userMessage];
  const bodyJSON = {
    model,
    messages,
    stream,
  };

  const body = JSON.stringify(bodyJSON);

  const response = await fetch(api, {
    method,
    headers,
    body,
  });

  const result = { response };

  return result;
};
