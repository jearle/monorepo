const resultPayloadFieldNames = new Set([`data`, `error`]);

const getDirectKeyName = (node) => {
  if (node.computed === true) {
    return null;
  }

  if (node.key.type === `Identifier`) {
    return node.key.name;
  }

  if (node.key.type === `Literal` && typeof node.key.value === `string`) {
    return node.key.value;
  }

  return null;
};

const checkIsValueNull = (node) =>
  node.type === `Literal` && node.value === null;

const checkIsTypeNull = (node) => node?.type === `TSNullKeyword`;

const checkHasField = (fields, keyName) => {
  const result = fields.some((field) => field.keyName === keyName);

  return result;
};

const reportInvalidFields = (props) => {
  const { context, fields } = props;
  const hasStatus = checkHasField(fields, `status`);
  const hasData = checkHasField(fields, `data`);
  const hasError = checkHasField(fields, `error`);

  if (hasStatus !== true || hasData !== true || hasError !== true) {
    return;
  }

  const nullPayloadFields = fields.filter(
    (field) => resultPayloadFieldNames.has(field.keyName) && field.isNull,
  );

  nullPayloadFields.forEach((field) => {
    context.report({
      node: field.reportNode,
      messageId: `noNullCompanionResultField`,
    });
  });
};

const checkObjectExpression = (props) => {
  const { context, node } = props;
  const fields = node.properties
    .filter((property) => property.type === `Property`)
    .map((property) => {
      const keyName = getDirectKeyName(property);

      if (keyName === null) {
        return null;
      }

      const result = {
        isNull: checkIsValueNull(property.value),
        keyName,
        reportNode: property.value,
      };

      return result;
    })
    .filter((field) => field !== null);

  reportInvalidFields({ context, fields });
};

const checkTypeLiteral = (props) => {
  const { context, node } = props;
  const fields = node.members
    .filter((member) => member.type === `TSPropertySignature`)
    .map((member) => {
      const keyName = getDirectKeyName(member);

      if (keyName === null) {
        return null;
      }

      const typeNode = member.typeAnnotation?.typeAnnotation ?? null;
      const result = {
        isNull: checkIsTypeNull(typeNode),
        keyName,
        reportNode: typeNode ?? member,
      };

      return result;
    })
    .filter((field) => field !== null);

  reportInvalidFields({ context, fields });
};

export const noNullCompanionResultFieldsRule = {
  meta: {
    type: `problem`,
    docs: {
      description: `Disallow null companion payload fields in structured result literals.`,
    },
    schema: [],
    messages: {
      noNullCompanionResultField: `Result branches must carry only their branch-specific payload; remove the null companion payload field.`,
    },
  },
  create(context) {
    return {
      ObjectExpression(node) {
        checkObjectExpression({ context, node });
      },

      TSTypeLiteral(node) {
        checkTypeLiteral({ context, node });
      },
    };
  },
};
