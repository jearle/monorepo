import { expect, test } from 'bun:test';

import {
  CHAT_MESSAGE_TEXT_ERROR_CODE_EMPTY_CHAT_MESSAGE_TEXT,
  CHAT_MESSAGE_TEXT_ERROR_CODE_MALFORMED_CHAT_MESSAGES,
  CHAT_MESSAGE_TEXT_ERROR_CODE_MALFORMED_CHAT_MESSAGE_CONTENT_PART,
  CHAT_MESSAGE_TEXT_ERROR_CODE_UNSUPPORTED_CHAT_MESSAGE_CONTENT_PART,
  EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_ERROR,
  EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_SUCCESS,
  extractChatMessageTexts,
} from '.';

test(`extractChatMessageTexts({ chatMessages }) returns text records for multi-turn chat messages`, () => {
  const result = extractChatMessageTexts({
    chatMessages: [
      {
        role: `system`,
        content: `  Follow the policy.  `,
      },
      {
        role: `user`,
        content: `First user turn.`,
      },
      {
        role: `assistant`,
        content: [
          {
            type: `text`,
            text: `First assistant turn.`,
          },
          {
            type: `text`,
            text: `Second assistant paragraph.`,
          },
        ],
      },
      {
        role: `user`,
        content: `Second user turn.`,
      },
    ],
  });

  expect(result).toEqual({
    status: EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_SUCCESS,
    data: {
      chatMessageTexts: [
        {
          chatMessageContentPartTexts: [],
          chatMessageIndex: 0,
          chatMessageRole: `system`,
          chatMessageText: `Follow the policy.`,
        },
        {
          chatMessageContentPartTexts: [],
          chatMessageIndex: 1,
          chatMessageRole: `user`,
          chatMessageText: `First user turn.`,
        },
        {
          chatMessageContentPartTexts: [
            `First assistant turn.`,
            `Second assistant paragraph.`,
          ],
          chatMessageIndex: 2,
          chatMessageRole: `assistant`,
          chatMessageText: `First assistant turn.\nSecond assistant paragraph.`,
        },
        {
          chatMessageContentPartTexts: [],
          chatMessageIndex: 3,
          chatMessageRole: `user`,
          chatMessageText: `Second user turn.`,
        },
      ],
      combinedChatMessageText: `Follow the policy.\nFirst user turn.\nFirst assistant turn.\nSecond assistant paragraph.\nSecond user turn.`,
    },
  });
});

test(`extractChatMessageTexts({ chatMessages }, { chatMessageRoles }) filters chat messages by role`, () => {
  const result = extractChatMessageTexts(
    {
      chatMessages: [
        {
          role: `system`,
          content: `System framing.`,
        },
        {
          role: `user`,
          content: `First user turn.`,
        },
        {
          role: `assistant`,
          content: `Assistant turn.`,
        },
        {
          role: `user`,
          content: `Second user turn.`,
        },
      ],
    },
    {
      chatMessageRoles: [`user`],
      chatMessageTextSeparator: `\n\n`,
    },
  );

  expect(result.status).toBe(EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_SUCCESS);

  if (result.status !== EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_SUCCESS) {
    expect.unreachable();
  }

  expect(result.data.chatMessageTexts).toEqual([
    {
      chatMessageContentPartTexts: [],
      chatMessageIndex: 1,
      chatMessageRole: `user`,
      chatMessageText: `First user turn.`,
    },
    {
      chatMessageContentPartTexts: [],
      chatMessageIndex: 3,
      chatMessageRole: `user`,
      chatMessageText: `Second user turn.`,
    },
  ]);
  expect(result.data.combinedChatMessageText).toBe(
    `First user turn.\n\nSecond user turn.`,
  );
});

test(`extractChatMessageTexts({ chatMessages }, { emptyChatMessageText }) handles empty text`, () => {
  const omitResult = extractChatMessageTexts({
    chatMessages: [
      {
        role: `user`,
        content: `   `,
      },
    ],
  });
  const includeResult = extractChatMessageTexts(
    {
      chatMessages: [
        {
          role: `user`,
          content: null,
        },
      ],
    },
    {
      emptyChatMessageText: `include`,
    },
  );
  const errorResult = extractChatMessageTexts(
    {
      chatMessages: [
        {
          role: `user`,
          content: `   `,
        },
      ],
    },
    {
      emptyChatMessageText: `error`,
    },
  );

  expect(omitResult.status).toBe(EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_SUCCESS);
  expect(includeResult.status).toBe(EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_SUCCESS);

  if (
    omitResult.status !== EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_SUCCESS ||
    includeResult.status !== EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_SUCCESS
  ) {
    expect.unreachable();
  }

  expect(omitResult.data.chatMessageTexts).toEqual([]);
  expect(includeResult.data.chatMessageTexts).toEqual([
    {
      chatMessageContentPartTexts: [],
      chatMessageIndex: 0,
      chatMessageRole: `user`,
      chatMessageText: ``,
    },
  ]);
  expect(errorResult.status).toBe(EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_ERROR);

  if (errorResult.status !== EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_ERROR) {
    expect.unreachable();
  }

  expect(errorResult.error.code).toBe(
    CHAT_MESSAGE_TEXT_ERROR_CODE_EMPTY_CHAT_MESSAGE_TEXT,
  );
});

test(`extractChatMessageTexts({ chatMessages }, { unsupportedChatMessageContentPart }) handles unsupported content parts`, () => {
  const omitResult = extractChatMessageTexts(
    {
      chatMessages: [
        {
          role: `user`,
          content: [
            {
              type: `image_url`,
              image_url: {
                url: `https://example.com/image.png`,
              },
            },
            {
              type: `text`,
              text: `Visible text.`,
            },
          ],
        },
      ],
    },
    {
      unsupportedChatMessageContentPart: `omit`,
    },
  );
  const errorResult = extractChatMessageTexts({
    chatMessages: [
      {
        role: `user`,
        content: [
          {
            type: `image_url`,
            image_url: {
              url: `https://example.com/image.png`,
            },
          },
        ],
      },
    ],
  });

  expect(omitResult.status).toBe(EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_SUCCESS);

  if (omitResult.status !== EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_SUCCESS) {
    expect.unreachable();
  }

  expect(omitResult.data.combinedChatMessageText).toBe(`Visible text.`);
  expect(errorResult.status).toBe(EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_ERROR);

  if (errorResult.status !== EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_ERROR) {
    expect.unreachable();
  }

  expect(errorResult.error).toEqual({
    chatMessageContentPartIndex: 0,
    chatMessageIndex: 0,
    code: CHAT_MESSAGE_TEXT_ERROR_CODE_UNSUPPORTED_CHAT_MESSAGE_CONTENT_PART,
    message: `chat message text extraction only supports text content parts`,
  });
});

test(`extractChatMessageTexts({ chatMessages }) errors on malformed chat messages and text content parts`, () => {
  const malformedMessagesResult = extractChatMessageTexts({
    chatMessages: [
      {
        role: `customer`,
        content: `Unsupported role.`,
      },
    ],
  });
  const malformedContentPartResult = extractChatMessageTexts({
    chatMessages: [
      {
        role: `user`,
        content: [
          {
            type: `text`,
          },
        ],
      },
    ],
  });

  expect(malformedMessagesResult.status).toBe(
    EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_ERROR,
  );
  expect(malformedContentPartResult.status).toBe(
    EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_ERROR,
  );

  if (
    malformedMessagesResult.status !==
      EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_ERROR ||
    malformedContentPartResult.status !==
      EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_ERROR
  ) {
    expect.unreachable();
  }

  expect(malformedMessagesResult.error.code).toBe(
    CHAT_MESSAGE_TEXT_ERROR_CODE_MALFORMED_CHAT_MESSAGES,
  );
  expect(malformedContentPartResult.error.code).toBe(
    CHAT_MESSAGE_TEXT_ERROR_CODE_MALFORMED_CHAT_MESSAGE_CONTENT_PART,
  );
});
