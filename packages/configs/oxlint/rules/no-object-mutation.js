import {
  checkIsObjectMutationCall,
  getStaticPropertyName,
} from './no-object-mutation-helpers.js';

const mutatingArrayMethodNames = new Set([
  `copyWithin`,
  `fill`,
  `pop`,
  `push`,
  `reverse`,
  `shift`,
  `sort`,
  `splice`,
  `unshift`,
]);

const getRuleOptions = (context) => {
  const [options] = context.options;
  const result = {
    allowCurrentPropertyAssignment:
      options?.allowCurrentPropertyAssignment === true,
    requireObjectMutationApiChecks:
      options?.requireObjectMutationApiChecks === true,
  };

  return result;
};

const checkShouldAllowMemberMutation = (props) => {
  const { node, options } = props;
  const propertyName = getStaticPropertyName(node);

  if (
    options.allowCurrentPropertyAssignment === true &&
    propertyName === `current`
  ) {
    return true;
  }

  return false;
};

export const noObjectMutationRule = {
  meta: {
    type: `problem`,
    docs: {
      description: `Disallow deterministic object and array mutation patterns.`,
    },
    schema: [
      {
        type: `object`,
        additionalProperties: false,
        properties: {
          allowCurrentPropertyAssignment: {
            type: `boolean`,
          },
          requireObjectMutationApiChecks: {
            type: `boolean`,
          },
        },
      },
    ],
    messages: {
      noMemberAssignment: `Do not mutate object properties; create a new value instead.`,
      noMemberUpdate: `Do not mutate object properties with update expressions; create a new value instead.`,
      noMutatingArrayMethod: `Do not use mutating array methods; create a new array instead.`,
      noObjectMutationCall: `Do not call an object mutation API; construct a new value instead.`,
    },
  },
  create(context) {
    const options = getRuleOptions(context);

    return {
      AssignmentExpression(node) {
        if (node.left.type !== `MemberExpression`) {
          return;
        }

        const shouldAllowMemberMutation = checkShouldAllowMemberMutation({
          node: node.left,
          options,
        });

        if (shouldAllowMemberMutation) {
          return;
        }

        context.report({
          node: node.left,
          messageId: `noMemberAssignment`,
        });
      },

      CallExpression(node) {
        if (node.callee.type !== `MemberExpression`) {
          return;
        }

        const propertyName = getStaticPropertyName(node.callee);

        if (
          propertyName !== null &&
          mutatingArrayMethodNames.has(propertyName)
        ) {
          context.report({
            node: node.callee.property,
            messageId: `noMutatingArrayMethod`,
          });
        }

        if (
          options.requireObjectMutationApiChecks === true &&
          checkIsObjectMutationCall(node.callee)
        ) {
          context.report({
            node: node.callee,
            messageId: `noObjectMutationCall`,
          });
        }
      },

      UpdateExpression(node) {
        if (node.argument.type !== `MemberExpression`) {
          return;
        }

        const shouldAllowMemberMutation = checkShouldAllowMemberMutation({
          node: node.argument,
          options,
        });

        if (shouldAllowMemberMutation) {
          return;
        }

        context.report({
          node: node.argument,
          messageId: `noMemberUpdate`,
        });
      },
    };
  },
};
