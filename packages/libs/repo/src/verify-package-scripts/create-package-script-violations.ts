import { type WorkspacePackage, checkIsArchivedPackage } from '../workspace';
import { FORBIDDEN_PACKAGE_SCRIPT_COMMANDS } from './constants';
import { createExpectedScriptRequirements } from './create-expected-script-requirements';

const createRequirementViolations = (packageInfo: WorkspacePackage) => {
  const scripts = packageInfo.packageJson.scripts ?? {};
  const requirements = createExpectedScriptRequirements(packageInfo);
  const result = requirements.flatMap((requirement) => {
    const script = scripts[requirement.name];

    if (script === requirement.command) {
      return [];
    }

    if (script === undefined) {
      return [
        `${packageInfo.relativeDirectory} ${requirement.name}: missing ${requirement.command}`,
      ];
    }

    return [
      `${packageInfo.relativeDirectory} ${requirement.name}: expected ${requirement.command}, found ${script}`,
    ];
  });

  return result;
};

const createDirectToolingViolations = (packageInfo: WorkspacePackage) => {
  const scripts = packageInfo.packageJson.scripts ?? {};
  const result = Object.entries(scripts).flatMap(([scriptName, script]) => {
    const forbiddenCommand = FORBIDDEN_PACKAGE_SCRIPT_COMMANDS.find((command) =>
      command.pattern.test(script),
    );

    if (forbiddenCommand === undefined) {
      return [];
    }

    return [
      `${packageInfo.relativeDirectory} ${scriptName}: direct ${forbiddenCommand.label} usage must go through Monorepo repo package commands`,
    ];
  });

  return result;
};

export const createPackageScriptViolations = (
  packageInfo: WorkspacePackage,
) => {
  if (checkIsArchivedPackage(packageInfo)) {
    return [];
  }

  const requirementViolations = createRequirementViolations(packageInfo);
  const directToolingViolations = createDirectToolingViolations(packageInfo);
  const result = [...requirementViolations, ...directToolingViolations];

  return result;
};
