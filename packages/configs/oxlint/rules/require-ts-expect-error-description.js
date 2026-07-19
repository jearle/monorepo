const tsExpectErrorDescriptionPattern = /@ts-expect-error:\s+\S/u;

export const requireTsExpectErrorDescriptionRule = {
  meta: {
    type: `problem`,
    docs: {
      description: `Require described @ts-expect-error comments and disallow @ts-ignore.`,
    },
    schema: [],
    messages: {
      noTsIgnore: `Use @ts-expect-error with a description instead of @ts-ignore.`,
      requireTsExpectErrorDescription: `Add a description after @ts-expect-error, for example @ts-expect-error: value must be a number.`,
    },
  },
  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode();

    return {
      Program() {
        for (const comment of sourceCode.getAllComments()) {
          const isTsIgnoreComment = comment.value.includes(`@ts-ignore`);

          if (isTsIgnoreComment) {
            context.report({
              loc: comment.loc,
              messageId: `noTsIgnore`,
            });
            continue;
          }

          const isTsExpectErrorComment =
            comment.value.includes(`@ts-expect-error`) &&
            !tsExpectErrorDescriptionPattern.test(comment.value);

          if (isTsExpectErrorComment) {
            context.report({
              loc: comment.loc,
              messageId: `requireTsExpectErrorDescription`,
            });
          }
        }
      },
    };
  },
};
