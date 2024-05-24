import { createContext, useContext } from 'react';
import { jwtDecode, JwtPayload } from 'jwt-decode'; // https://www.npmjs.com/package/jwt-decode
import { ApiResponse, AuthData } from '../types';

interface AuthContextData {
  authData: AuthData | null;
  login: (data: ApiResponse) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextData>({
  authData: null,
  login: () => {},
  logout: () => {},
});

/**
 * Returns an object containing `AuthContext` data and functions:
 * - `authData` is an object containing a JWT payload.
 * - `login` and `logout` are functions.
 * @returns {AuthContextData}
 */
export const useAuth = () => useContext(AuthContext);

/**
 * Return decoded JWT payload from given token
 * @param {string | null} token - JWT
 * @returns {JwTPayload}
 */
export const decodeToken = (token: string | null) => {
  if (!token) return null;

  try {
    const authData = jwtDecode(token);
    return authData;
  } catch (err) {
    return null;
  }
};

/**
 * Check whether given JWT payload is expired.
 * Returns `true` if `null` is given as argument.
 * @param {JwtPayload | null} authData
 * @returns {boolean}
 */
export const isPayloadExpired = (authData: JwtPayload | null) =>
  authData?.exp ? authData.exp * 1000 < Date.now() : true;
