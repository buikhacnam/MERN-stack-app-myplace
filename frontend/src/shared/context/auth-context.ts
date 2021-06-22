import { createContext } from 'react';

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  login: (id: string, token: string) => {},
  logout: () => {},
  token: null
});
