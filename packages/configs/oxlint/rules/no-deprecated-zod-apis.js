import { createZodImportTracker } from './zod-import-helpers.js';

const zodStringFormatMethods = new Map([
  [`base64`, `z.base64()`],
  [`base64url`, `z.base64url()`],
  [`cidrv4`, `z.cidrv4()`],
  [`cidrv6`, `z.cidrv6()`],
  [`cuid`, `z.cuid2()`],
  [`cuid2`, `z.cuid2()`],
  [`date`, `z.iso.date()`],
  [`datetime`, `z.iso.datetime()`],
  [`duration`, `z.iso.duration()`],
  [`e164`, `z.e164()`],
  [`email`, `z.email()`],
  [`emoji`, `z.emoji()`],
  [`guid`, `z.guid()`],
  [`ipv4`, `z.ipv4()`],
  [`ipv6`, `z.ipv6()`],
  [`jwt`, `z.jwt()`],
  [`ksuid`, `z.ksuid()`],
  [`nanoid`, `z.nanoid()`],
  [`time`, `z.iso.time()`],
  [`ulid`, `z.ulid()`],
  [`url`, `z.url()`],
  [`uuid`, `z.uuid()`],
  [`uuidv4`, `z.uuidv4()`],
  [`uuidv6`, `z.uuidv6()`],
  [`uuidv7`, `z.uuidv7()`],
  [`xid`, `z.xid()`],
]);

const getMemberPropertyName = (node) => {
  if (node?.type !== `MemberExpression` || node.computed) {
    return null;
  }

  const property = node.property;

  if (property.type !== `Identifier`) {
    return null;
  }

  return property.name;
};

const checkIsZodFactoryCall = (node, factoryName) => {
  if (node?.type !== `CallExpression`) {
    return false;
  }

  const callee = node.callee;

  if (callee.type !== `MemberExpression` || callee.computed) {
    return false;
  }

  const isZodFactory =
    callee.object.type === `Identifier` &&
    callee.object.name === `z` &&
    getMemberPropertyName(callee) === factoryName;

  return isZodFactory;
};

const checkHasZodFactoryCall = (node, factoryName) => {
  if (node === null || node === undefined) {
    return false;
  }

  if (checkIsZodFactoryCall(node, factoryName)) {
    return true;
  }

  if (node.type === `CallExpression`) {
    return checkHasZodFactoryCall(node.callee, factoryName);
  }

  if (node.type === `MemberExpression`) {
    return checkHasZodFactoryCall(node.object, factoryName);
  }

  return false;
};

const getCallMember = (node) => {
  if (node.callee.type !== `MemberExpression`) {
    return null;
  }

  const name = getMemberPropertyName(node.callee);

  if (name === null) {
    return null;
  }

  const result = {
    name,
    object: node.callee.object,
  };

  return result;
};

const getZodIssueCodeObjectIdentifier = (node) => {
  if (node.type !== `MemberExpression` || node.computed) {
    return null;
  }

  const object = node.object;

  if (object.type !== `Identifier`) {
    return null;
  }

  const propertyName = getMemberPropertyName(node);

  if (propertyName !== `ZodIssueCode`) {
    return null;
  }

  return object;
};

const checkIsSchemaIdentifier = (node) =>
  node?.type === `Identifier` && node.name.endsWith(`Schema`);

const checkIsZodSchemaObject = (node) => {
  if (checkIsSchemaIdentifier(node)) {
    return true;
  }

  const result =
    checkHasZodFactoryCall(node, `object`) ||
    checkHasZodFactoryCall(node, `strictObject`) ||
    checkHasZodFactoryCall(node, `looseObject`);

  return result;
};

const reportDeprecatedZodCall = ({ context, messageId, node, replacement }) => {
  context.report({
    node,
    messageId,
    data: { replacement },
  });
};

export const noDeprecatedZodApisRule = {
  meta: {
    type: `problem`,
    docs: {
      description: `Disallow deprecated and legacy Zod APIs in favor of Zod 4 APIs.`,
    },
    schema: [],
    messages: {
      noDeprecatedZodApi: `Use {{ replacement }} instead of this deprecated or legacy Zod API.`,
    },
  },
  create(context) {
    const sourceCode = context.sourceCode;
    const zodImportTracker = createZodImportTracker(sourceCode);
    const zodIssueCodeCandidates = [];

    return {
      ImportDeclaration(node) {
        zodImportTracker.recordImportDeclaration(node);
      },

      MemberExpression(node) {
        const object = getZodIssueCodeObjectIdentifier(node);

        if (object === null) {
          return;
        }

        zodIssueCodeCandidates.push({ node, object });
      },

      'Program:exit'() {
        for (const candidate of zodIssueCodeCandidates) {
          const { node, object } = candidate;
          const binding = zodImportTracker.getBinding(object.name);

          if (
            binding === undefined ||
            zodImportTracker.checkIdentifierReferencesBinding(binding, object) ===
              false
          ) {
            continue;
          }

          reportDeprecatedZodCall({
            context,
            messageId: `noDeprecatedZodApi`,
            node,
            replacement: `raw Zod issue code values or Monorepo constants wrapping them`,
          });
        }
      },

      CallExpression(node) {
        const member = getCallMember(node);

        if (member === null) {
          return;
        }

        const stringFormatReplacement = zodStringFormatMethods.get(member.name);

        if (
          stringFormatReplacement !== undefined &&
          checkHasZodFactoryCall(member.object, `string`)
        ) {
          reportDeprecatedZodCall({
            context,
            messageId: `noDeprecatedZodApi`,
            node,
            replacement: stringFormatReplacement,
          });
          return;
        }

        if (
          member.name === `int` &&
          checkHasZodFactoryCall(member.object, `number`)
        ) {
          reportDeprecatedZodCall({
            context,
            messageId: `noDeprecatedZodApi`,
            node,
            replacement: `z.int()`,
          });
          return;
        }

        if (
          member.name === `finite` &&
          checkHasZodFactoryCall(member.object, `number`)
        ) {
          reportDeprecatedZodCall({
            context,
            messageId: `noDeprecatedZodApi`,
            node,
            replacement: `z.number()`,
          });
          return;
        }

        if (
          member.name === `safe` &&
          checkHasZodFactoryCall(member.object, `number`)
        ) {
          reportDeprecatedZodCall({
            context,
            messageId: `noDeprecatedZodApi`,
            node,
            replacement: `z.int()`,
          });
          return;
        }

        if (
          member.name === `step` &&
          checkHasZodFactoryCall(member.object, `number`)
        ) {
          reportDeprecatedZodCall({
            context,
            messageId: `noDeprecatedZodApi`,
            node,
            replacement: `.multipleOf()`,
          });
          return;
        }

        if (
          member.name === `strict` &&
          checkHasZodFactoryCall(member.object, `object`)
        ) {
          reportDeprecatedZodCall({
            context,
            messageId: `noDeprecatedZodApi`,
            node,
            replacement: `z.strictObject()`,
          });
          return;
        }

        if (
          member.name === `passthrough` &&
          checkHasZodFactoryCall(member.object, `object`)
        ) {
          reportDeprecatedZodCall({
            context,
            messageId: `noDeprecatedZodApi`,
            node,
            replacement: `z.looseObject()`,
          });
          return;
        }

        if (member.name === `merge` && checkIsZodSchemaObject(member.object)) {
          reportDeprecatedZodCall({
            context,
            messageId: `noDeprecatedZodApi`,
            node,
            replacement: `shape spreading or .extend()`,
          });
          return;
        }

        if (
          member.name === `nativeEnum` &&
          checkIsZodFactoryCall(node, `nativeEnum`)
        ) {
          reportDeprecatedZodCall({
            context,
            messageId: `noDeprecatedZodApi`,
            node,
            replacement: `z.enum()`,
          });
          return;
        }

        if (member.name === `nonstrict`) {
          reportDeprecatedZodCall({
            context,
            messageId: `noDeprecatedZodApi`,
            node,
            replacement: `z.object()`,
          });
          return;
        }

        if (member.name === `deepPartial`) {
          reportDeprecatedZodCall({
            context,
            messageId: `noDeprecatedZodApi`,
            node,
            replacement: `an explicit partial schema`,
          });
          return;
        }
      },
    };
  },
};
