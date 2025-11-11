import {
  type StrongPasswordOptions,
  isStrongPassword as isStrongPasswordValidator,
} from 'validator';
import { STRONG_PASSWORD_OPTIONS_DEFAULT } from './constants';

export const scoreStrongPassword = (
  password: string,
  options: StrongPasswordOptions = STRONG_PASSWORD_OPTIONS_DEFAULT,
) => {
  const optionsWithReturnScore = {
    ...options,
    returnScore: true as const,
  };
  const score = isStrongPasswordValidator(password, optionsWithReturnScore);

  return score;
};
