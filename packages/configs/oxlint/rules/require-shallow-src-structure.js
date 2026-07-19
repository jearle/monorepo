import {
  checkIsCapitalCase,
  checkIsDeclarationFilename,
  checkHasTemplatePlaceholderName,
  checkIsKebabCase,
  checkIsTemplatePlaceholderName,
  checkIsTypeScriptSourceFilename,
  getPackageSrcPath,
  getRuleFilename,
  getSourceFileExtension,
  getSourceFileStem,
  getSourcePathSegments,
  stripTestSuffix,
  stripSourceRoleSuffix,
} from './rule-path-helpers.js';

const rootFileStems = new Set([`index`, `main`]);
const packageGlobalFolderNames = new Set([`test`, `test-support`]);

const checkIsAllowedRootFile = (stem) =>
  rootFileStems.has(stripTestSuffix(stem));

const checkIsAllowedSourceFolder = (folderName) =>
  checkIsKebabCase(folderName) ||
  checkIsTemplatePlaceholderName(folderName) ||
  packageGlobalFolderNames.has(folderName);

const checkIsAllowedFileStem = (stem, extension) => {
  const sourceStem = stripSourceRoleSuffix(stem);
  const isRootFileStem = rootFileStems.has(sourceStem);

  if (isRootFileStem) {
    return true;
  }

  if (checkHasTemplatePlaceholderName(sourceStem)) {
    return true;
  }

  const isReactComponentFile =
    extension === `.tsx` && checkIsCapitalCase(sourceStem);

  if (isReactComponentFile) {
    return true;
  }

  const isKebabCaseFileStem = checkIsKebabCase(sourceStem);

  return isKebabCaseFileStem;
};

export const requireShallowSrcStructureRule = {
  meta: {
    type: `suggestion`,
    docs: {
      description: `Require shallow src layout and conventional file names.`,
    },
    schema: [],
    messages: {
      requireFeatureFolder: `Place implementation files under a first-depth feature folder in src/.`,
      requireShallowSrcStructure: `Keep src/ structure shallow: use src/<feature>/<file>.`,
      requireKebabFolderName: `Use kebab-case folder names under src/.`,
      requireKebabFileName: `Use kebab-case file names, except React component files may use CapitalCase.tsx.`,
    },
  },
  create(context) {
    const filename = getRuleFilename(context);
    const isTypeScriptSourceFilename =
      checkIsTypeScriptSourceFilename(filename);
    const isDeclarationFilename = checkIsDeclarationFilename(filename);

    if (!isTypeScriptSourceFilename || isDeclarationFilename) {
      return {};
    }

    const packageSrcPath = getPackageSrcPath(filename);

    if (packageSrcPath === null) {
      return {};
    }

    return {
      Program(node) {
        const segments = getSourcePathSegments(packageSrcPath.srcPath);
        const fileStem = getSourceFileStem(filename);
        const fileExtension = getSourceFileExtension(filename);
        const fileNameNode = node;
        const isMissingFeatureFolder =
          segments.length === 1 && !checkIsAllowedRootFile(fileStem);

        if (isMissingFeatureFolder) {
          context.report({
            node: fileNameNode,
            messageId: `requireFeatureFolder`,
          });
        }

        const isTooDeep = segments.length > 2;

        if (isTooDeep) {
          context.report({
            node: fileNameNode,
            messageId: `requireShallowSrcStructure`,
          });
        }

        const folderSegments = segments.slice(0, -1);

        for (const folderName of folderSegments) {
          const isAllowedSourceFolder = checkIsAllowedSourceFolder(folderName);

          if (isAllowedSourceFolder) {
            continue;
          }

          context.report({
            node: fileNameNode,
            messageId: `requireKebabFolderName`,
          });
        }

        const isAllowedFileStem = checkIsAllowedFileStem(
          fileStem,
          fileExtension,
        );

        if (isAllowedFileStem) {
          return;
        }

        context.report({
          node: fileNameNode,
          messageId: `requireKebabFileName`,
        });
      },
    };
  },
};
