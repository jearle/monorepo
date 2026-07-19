export const checkIsAbsoluteUrl = (value: string) => {
  try {
    new URL(value);

    return true;
  } catch {
    return false;
  }
};
