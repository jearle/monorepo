export const printPackageScriptViolations = (violations: readonly string[]) => {
  if (violations.length === 0) {
    return;
  }

  console.log(`\nPackage script violations: ${violations.length}`);

  violations.forEach((violation) => {
    console.log(`- ${violation}`);
  });
};
