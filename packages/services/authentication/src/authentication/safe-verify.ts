import { verify, type JwtPayload } from 'jsonwebtoken';

import { PayloadSchema } from './payload-schema';

type PropsSafeVerify = {
  readonly token: string;
  readonly jwtSecret: string;
};
export const safeVerify = (props: PropsSafeVerify) => {
  const { token, jwtSecret } = props;

  let maybePayload: undefined | string | JwtPayload = undefined;
  try {
    maybePayload = verify(token, jwtSecret);
  } catch (unknownError: unknown) {
    const error =
      unknownError instanceof Error
        ? unknownError
        : new Error('Unknown error during token verification');

    const result = {
      success: false as const,
      error,
    };

    return result;
  }

  const payloadParseResult = PayloadSchema.safeParse(maybePayload);

  const { success } = payloadParseResult;
  if (success === false) {
    const { error } = payloadParseResult;

    const result = {
      success: false as const,
      error,
    };

    return result;
  }

  const { data: payload } = payloadParseResult;

  const result = { success: true as const, payload };

  return result;
};
