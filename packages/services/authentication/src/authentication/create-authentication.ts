import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { type StringValue } from 'ms';

import { type DurationString, addDuration, isAfter } from '@jearle/util-date';

import {
  type Users,
  type NewUser,
  type LoginUser,
  NewUserSchema,
  LoginUserSchema,
} from '../users';
import { TOKEN_TYPE_REFRESH, type UserTokens } from '../user-tokens';

import { safeVerify } from './safe-verify';
import type { AuthenticatePayload } from './types';

export type PropsCreateAuthentication = {
  readonly users: Users;
  readonly userTokens: UserTokens;
  readonly jwtSecret: string;
  readonly jwtExpiresIn?: StringValue;
  readonly refreshTokenExpiresIn?: StringValue;
};
export const createAuthentication = (props: PropsCreateAuthentication) => {
  const {
    users,
    userTokens,
    jwtSecret,
    jwtExpiresIn = `15m`,
    refreshTokenExpiresIn = `30d`,
  } = props;

  type PropsSignUp = NewUser;
  const signUp = async (props: PropsSignUp) => {
    const safeParseNewUserResult = NewUserSchema.safeParse(props);
    const { success: safeParseNewUserSuccess } = safeParseNewUserResult;

    if (safeParseNewUserSuccess === false) {
      const { error } = safeParseNewUserResult;

      const result = {
        success: false as const,
        error,
      };

      return result;
    }

    const { data: newUser } = safeParseNewUserResult;

    const { password, email } = newUser;

    const passwordHash = await hash(password, 12);
    const nextUser = { email, passwordHash };

    const userCreateResult = await users.create(nextUser);
    const { success } = userCreateResult;

    if (success === false) {
      const { error } = userCreateResult;

      const result = {
        success: false as const,
        error,
      };

      return result;
    }

    const result = {
      success: true as const,
    };

    return result;
  };

  type PropsLogin = LoginUser;
  const login = async (props: PropsLogin) => {
    const safeParseLoginUserResult = LoginUserSchema.safeParse(props);
    const { success: safeParseLoginUserSuccess } = safeParseLoginUserResult;

    if (safeParseLoginUserSuccess === false) {
      const { error } = safeParseLoginUserResult;

      const result = {
        success: false as const,
        error,
      };

      return result;
    }

    const { data: loginUser } = safeParseLoginUserResult;
    const { email, password } = loginUser;

    const userReadResult = await users.readBy({ email });
    const { success: userReadSuccess } = userReadResult;

    if (userReadSuccess === false) {
      const { error } = userReadResult;
      const result = {
        success: false as const,
        error,
      };

      return result;
    }

    const { entity: user } = userReadResult;
    const { passwordHash } = user;
    const isValidPassword = await compare(password, passwordHash);

    if (isValidPassword === false) {
      const result = {
        success: false as const,
        error: new Error(`Invalid credentials`),
      };

      return result;
    }

    const { id, jwtVersion } = user;

    const accessToken = sign(
      { userId: id, jwtVersion: jwtVersion },
      jwtSecret,
      { expiresIn: jwtExpiresIn },
    );

    const refreshToken = sign(
      { userId: id, jwtVersion: jwtVersion },
      jwtSecret,
      { expiresIn: refreshTokenExpiresIn },
    );

    const durationResult = addDuration(refreshTokenExpiresIn as DurationString);
    const { success: durationSuccess } = durationResult;

    if (durationSuccess === false) {
      const { error } = durationResult;
      const result = {
        success: false as const,
        error,
      };

      return result;
    }
    const { date: expiresAt } = durationResult;

    const userTokenResult = await userTokens.create({
      userId: id,
      token: refreshToken,
      tokenType: `refresh`,
      expiresAt,
    });

    const { success: successUserToken } = userTokenResult;

    if (successUserToken === false) {
      const result = {
        success: false as const,
        error: new Error(`Failed to save user token`),
      };

      return result;
    }

    const result = {
      success: true as const,
      accessToken,
      refreshToken,
    };

    return result;
  };

  type PropsAuthenticate = AuthenticatePayload;
  const authenticate = async (props: PropsAuthenticate) => {
    const { accessToken } = props;

    const verifyResult = safeVerify({
      token: accessToken,
      jwtSecret,
    });

    const { success } = verifyResult;
    if (success === false) {
      const { error } = verifyResult;

      const result = {
        success: false as const,
        error,
      };

      return result;
    }

    const { payload } = verifyResult;

    const { userId, jwtVersion } = payload;

    const userReadResult = await users.read({ id: userId });
    const { success: userReadSuccess } = userReadResult;
    if (userReadSuccess === false) {
      const { error } = userReadResult;

      const result = {
        success: false as const,
        error,
      };

      return result;
    }
    const { entity: user } = userReadResult;

    if (user.jwtVersion !== jwtVersion) {
      const result = {
        success: false as const,
        error: new Error(`Token is invalidated`),
      };

      return result;
    }

    const result = { success: true as const };

    return result;
  };

  type PropsRefresh = {
    readonly refreshToken: string;
  };
  const refresh = async (props: PropsRefresh) => {
    const { refreshToken } = props;

    // read user token
    const readUserTokenResult = await userTokens.readBy({
      token: refreshToken,
    });

    const { success: readUserTokenSuccess } = readUserTokenResult;
    if (readUserTokenSuccess === false) {
      const { error } = readUserTokenResult;

      const result = {
        success: false as const,
        error,
      };

      return result;
    }

    const { entity: refreshUserToken } = readUserTokenResult;
    const { userId, expiresAt, tokenType } = refreshUserToken;

    // read user associated with token
    const readUserResult = await users.read({ id: userId });
    const { success: readUserSuccess } = readUserResult;
    if (readUserSuccess === false) {
      const { error } = readUserResult;

      const result = {
        success: false as const,
        error,
      };

      return result;
    }
    const { entity: user } = readUserResult;

    // check that the token is a refresh token
    if (tokenType !== TOKEN_TYPE_REFRESH) {
      const result = {
        success: false as const,
        error: new Error(`Token not a refresh token`),
      };

      return result;
    }

    // destroy token to prepare for rotation
    const destroyedUserTokenResult = await userTokens.destroyBy({
      token: refreshToken,
    });
    const { success: destroyedUserTokenSuccess } = destroyedUserTokenResult;
    if (destroyedUserTokenSuccess === false) {
      const { error } = destroyedUserTokenResult;

      const result = {
        success: false as const,
        error,
      };

      return result;
    }

    const isExpired = isAfter(new Date(), expiresAt);
    if (isExpired) {
      const result = {
        success: false as const,
        error: new Error(`Refresh token is expired`),
      };

      return result;
    }

    const verifyResult = safeVerify({
      token: refreshUserToken.token,
      jwtSecret,
    });

    const { success } = verifyResult;
    if (success === false) {
      const { error } = verifyResult;

      const result = {
        success: false as const,
        error,
      };

      return result;
    }

    const { payload } = verifyResult;

    const { jwtVersion } = payload;
    if (user.jwtVersion !== jwtVersion) {
      const result = {
        success: false as const,
        error: new Error(`Token is invalidated`),
      };

      return result;
    }

    const accessToken = sign(
      { userId: user.id, jwtVersion: user.jwtVersion },
      jwtSecret,
      { expiresIn: jwtExpiresIn },
    );

    const nextRefreshToken = sign(
      { userId: user.id, jwtVersion: jwtVersion },
      jwtSecret,
      { expiresIn: refreshTokenExpiresIn },
    );

    const durationResult = addDuration(refreshTokenExpiresIn as DurationString);
    const { success: durationSuccess } = durationResult;

    if (durationSuccess === false) {
      const { error } = durationResult;
      const result = {
        success: false as const,
        error,
      };

      return result;
    }
    const { date: nextExpiresAt } = durationResult;

    const userTokenResult = await userTokens.create({
      userId: user.id,
      token: nextRefreshToken,
      tokenType: `refresh`,
      expiresAt: nextExpiresAt,
    });

    const { success: successUserToken } = userTokenResult;

    if (successUserToken === false) {
      const result = {
        success: false as const,
        error: new Error(`Failed to save user token`),
      };

      return result;
    }

    const result = {
      success: true as const,
      accessToken,
      refreshToken: nextRefreshToken,
    };

    return result;
  };

  type PropsLogout = {
    readonly refreshToken: string;
  };
  const logout = async (props: PropsLogout) => {
    const { refreshToken } = props;

    const readUserTokenResult = await userTokens.readBy({
      token: refreshToken,
    });

    const { success: readUserTokenSuccess } = readUserTokenResult;
    if (readUserTokenSuccess === false) {
      const { error } = readUserTokenResult;

      const result = {
        success: false as const,
        error,
      };

      return result;
    }

    const { entity: refreshUserToken } = readUserTokenResult;

    const deleteResult = await userTokens.destroy({ id: refreshUserToken.id });

    const { success: deleteSuccess } = deleteResult;
    if (deleteSuccess === false) {
      const { error } = deleteResult;

      const result = {
        success: false as const,
        error,
      };

      return result;
    }

    const result = {
      success: true as const,
    };

    return result;
  };

  type PropsLogoutAll = {
    readonly userId: string;
  };
  const logoutAll = async (props: PropsLogoutAll) => {
    const { userId } = props;

    const readUserResult = await users.read({ id: userId });

    const { success: readUserSuccess } = readUserResult;
    if (readUserSuccess === false) {
      const { error } = readUserResult;

      const result = {
        success: false as const,
        error,
      };

      return result;
    }

    const { entity: user } = readUserResult;

    const updateUserResult = await users.update({
      id: userId,
      jwtVersion: user.jwtVersion + 1,
    });

    const { success: updateUserSuccess } = updateUserResult;
    if (updateUserSuccess === false) {
      const { error } = updateUserResult;

      const result = {
        success: false as const,
        error,
      };

      return result;
    }

    const deleteTokensResult = await userTokens.destroyBy({ userId });

    const { success: deleteTokensSuccess } = deleteTokensResult;
    if (deleteTokensSuccess === false) {
      const { error } = deleteTokensResult;

      const result = {
        success: false as const,
        error,
      };

      return result;
    }

    const result = {
      success: true as const,
    };

    return result;
  };

  const authentication = {
    signUp,
    login,
    authenticate,
    refresh,
    logout,
    logoutAll,
  };

  const result = { authentication };

  return result;
};

export type Authentication = ReturnType<
  typeof createAuthentication
>[`authentication`];
