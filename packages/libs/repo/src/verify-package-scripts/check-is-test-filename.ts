export const checkIsTestFilename = (filename: string) => {
  const result =
    filename.includes(`.test.`) ||
    filename.includes(`_test_`) ||
    filename.includes(`.spec.`) ||
    filename.includes(`_spec_`);

  return result;
};
