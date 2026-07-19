const indexSourceImportPattern =
  /(?:^|\/)index(?:\.(?:cjs|cts|js|jsx|mjs|mts|ts|tsx))?$/u;

const checkIsRelativeIndexSourceImport = (source) => {
  if (!source.startsWith(`.`)) {
    return false;
  }

  const result = indexSourceImportPattern.test(source);

  return result;
};

const stripIndexSourceImport = (source) => {
  if (source === `./index`) {
    return `.`;
  }

  if (source === `../index`) {
    return `..`;
  }

  const result = source.replace(
    /\/index(?:\.(?:cjs|cts|js|jsx|mjs|mts|ts|tsx))?$/u,
    ``,
  );

  return result;
};

const getImportSourceLiteral = (node) => {
  if (
    (node.type === `ImportDeclaration` ||
      node.type === `ExportNamedDeclaration` ||
      node.type === `ExportAllDeclaration`) &&
    node.source?.type === `Literal` &&
    typeof node.source.value === `string`
  ) {
    return node.source;
  }

  if (
    node.type === `ImportExpression` &&
    node.source.type === `Literal` &&
    typeof node.source.value === `string`
  ) {
    return node.source;
  }

  if (node.type !== `TSImportType`) {
    return null;
  }

  const sourceNode = node.source;

  if (sourceNode.type === `Literal` && typeof sourceNode.value === `string`) {
    return sourceNode;
  }

  if (
    sourceNode.type === `TSLiteralType` &&
    sourceNode.literal.type === `Literal` &&
    typeof sourceNode.literal.value === `string`
  ) {
    return sourceNode.literal;
  }

  return null;
};

const createLiteralReplacement = (sourceCode, node, source) => {
  const raw = sourceCode.getText(node);
  const quote = raw.at(0);

  if (quote !== `'` && quote !== `"`) {
    return null;
  }

  const directorySource = stripIndexSourceImport(source);
  const result = `${quote}${directorySource}${quote}`;

  return result;
};

const createImportVisitor = (context) => {
  const sourceCode = context.sourceCode;

  return (node) => {
    const literal = getImportSourceLiteral(node);
    const source = literal?.value;

    if (typeof source !== `string`) {
      return;
    }

    const isRelativeIndexSourceImport =
      checkIsRelativeIndexSourceImport(source);

    if (isRelativeIndexSourceImport === false) {
      return;
    }

    const replacement = createLiteralReplacement(sourceCode, literal, source);

    context.report({
      node: literal,
      messageId: `preferDirectoryIndexSourceImport`,
      fix(fixer) {
        if (replacement === null) {
          return null;
        }

        return fixer.replaceText(literal, replacement);
      },
    });
  };
};

export const preferDirectoryIndexSourceImportsRule = {
  meta: {
    type: `layout`,
    docs: {
      description: `Prefer directory imports for index source entrypoints.`,
    },
    fixable: `code`,
    schema: [],
    messages: {
      preferDirectoryIndexSourceImport: `Use the directory import path for index source entrypoints.`,
    },
  },
  create(context) {
    const visitImport = createImportVisitor(context);

    return {
      ExportAllDeclaration: visitImport,
      ExportNamedDeclaration: visitImport,
      ImportDeclaration: visitImport,
      ImportExpression: visitImport,
      TSImportType: visitImport,
    };
  },
};
