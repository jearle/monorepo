import {
  type CreateFakeChatResult,
  type FakeChat,
  type FakeChatCompletionCall,
  type FakeChatCompletionResult,
} from './types';

export type CreateFakeChatProps = {
  readonly completion: FakeChatCompletionResult;
};

export const createFakeChat = (
  props: CreateFakeChatProps,
): CreateFakeChatResult => {
  const { completion } = props;
  const calls: FakeChatCompletionCall[] = [];
  const chat: FakeChat = {
    completions: async (message) => {
      calls.push(message);

      const result = completion;

      return result;
    },
  };
  const result = { calls, chat };

  return result;
};
