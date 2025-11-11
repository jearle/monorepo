import {
  type StrongPasswordOptions,
  isStrongPassword as isStrongPasswordValidator,
} from 'validator';
import { STRONG_PASSWORD_OPTIONS_DEFAULT } from './constants';

export const determineIsStrongPassword = (
  password: string,
  options: StrongPasswordOptions = STRONG_PASSWORD_OPTIONS_DEFAULT,
) => {
  const optionsWithReturnScore = {
    ...options,
    returnScore: false as const,
  };
  const isStrongPassword = isStrongPasswordValidator(
    password,
    optionsWithReturnScore,
  );

  return isStrongPassword;
};
