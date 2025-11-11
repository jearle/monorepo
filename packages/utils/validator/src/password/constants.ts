export const STRONG_PASSWORD_OPTIONS_DEFAULT = {
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
  pointsPerUnique: 1,
  pointsPerRepeat: 0.5,
  pointsForContainingLower: 10,
  pointsForContainingUpper: 10,
  pointsForContainingNumber: 10,
  pointsForContainingSymbol: 10,
};

export const STRONG_PASSWORD_OPTIONS_DEFAULT_JSON = JSON.stringify(
  STRONG_PASSWORD_OPTIONS_DEFAULT,
);

export const STRONG_PASSWORD_THRESHOLD = 50;
