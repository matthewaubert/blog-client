import { createContext, useContext } from 'react';
import { ApiResponse } from '../types';

interface AuthContextData {
  isLoggedIn: boolean;
  login: (data: ApiResponse) => void;
  logout: () => void;
  token: string | null;
}

export const AuthContext = createContext<AuthContextData>({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  token: null,
});

export const useAuth = () => useContext(AuthContext);
