import { type ChatCompletionResult } from '../openrouter-chat';

export type CreateFakeChatResult = {
  readonly calls: readonly FakeChatCompletionCall[];
  readonly chat: FakeChat;
};

export type FakeChatCompletionCall = {
  readonly system?: string;
  readonly user: string;
};

export type FakeChatCompletionResult = ChatCompletionResult;

export type FakeChat = {
  readonly completions: (
    props: FakeChatCompletionCall,
  ) => Promise<FakeChatCompletionResult>;
};
