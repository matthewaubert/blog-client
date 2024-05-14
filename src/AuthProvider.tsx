import { useState } from 'react';
import { AuthContext } from './utils/auth-utils';
import { isStorageAvailable, isTokenAvailable } from './utils/local-storage';
import { ApiResponse } from './types';

interface Props {
  children: JSX.Element | JSX.Element[];
}

export default function AuthProvider({ children }: Props) {
  const [isLoggedIn, setIsLoggedIn] = useState(isTokenAvailable());
  const [token, setToken] = useState<string | null>(null);

  // if given data has a token and `localStorage` is available: set token in `localStorage`
  function login(data: ApiResponse) {
    if (data.token && isStorageAvailable('localStorage')) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setIsLoggedIn(true);
    }
  }

  // if `localStorage` is available and it has a token: remove token
  function logout() {
    if (isTokenAvailable()) {
      localStorage.removeItem('token');
    }

    setToken(null);
    setIsLoggedIn(false);
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
}
