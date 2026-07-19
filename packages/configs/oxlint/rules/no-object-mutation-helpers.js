const objectMutationMethodNames = new Map([
  [
    `Object`,
    new Set([
      `assign`,
      `defineProperties`,
      `defineProperty`,
      `preventExtensions`,
      `seal`,
      `setPrototypeOf`,
    ]),
  ],
  [
    `Reflect`,
    new Set([
      `defineProperty`,
      `deleteProperty`,
      `preventExtensions`,
      `set`,
      `setPrototypeOf`,
    ]),
  ],
]);

export const getStaticPropertyName = (node) => {
  if (node.computed !== true && node.property.type === `Identifier`) {
    return node.property.name;
  }

  if (
    node.computed === true &&
    node.property.type === `Literal` &&
    typeof node.property.value === `string`
  ) {
    return node.property.value;
  }

  if (
    node.computed === true &&
    node.property.type === `TemplateLiteral` &&
    node.property.expressions.length === 0
  ) {
    return node.property.quasis[0]?.value.cooked ?? null;
  }

  return null;
};

export const checkIsObjectMutationCall = (node) => {
  if (node.object.type !== `Identifier`) {
    return false;
  }

  const methodNames = objectMutationMethodNames.get(node.object.name);
  const propertyName = getStaticPropertyName(node);
  const result =
    methodNames !== undefined &&
    propertyName !== null &&
    methodNames.has(propertyName);

  return result;
};
