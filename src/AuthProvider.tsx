import { useState, useCallback, useMemo } from 'react';
import { AuthContext, decodeToken } from './utils/auth-utils';
import { isStorageAvailable, getJwtPayload } from './utils/local-storage';
import { ApiResponse } from './types';

interface Props {
  children: JSX.Element | JSX.Element[];
}

export default function AuthProvider({ children }: Props) {
  const [authData, setAuthData] = useState(getJwtPayload());

  // if given data has a token and `localStorage` is available:
  // store token in `localStorage` and set `authData` in app state
  const login = useCallback((data: ApiResponse) => {
    if (data.token && isStorageAvailable('localStorage')) {
      // console.log('stored!', data.token);
      localStorage.setItem('token', data.token);
      setAuthData(decodeToken(data.token));
    }
  }, []);

  // remove token from `localStorage` and `authData` from app state
  const logout = useCallback(() => {
    if (getJwtPayload() !== null) {
      localStorage.removeItem('token');
    }

    setAuthData(null); // remove `authData` from state
  }, []);

  const contextValue = useMemo(
    () => ({ authData, login, logout }),
    [authData, login, logout],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
