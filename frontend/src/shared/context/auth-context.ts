import { createContext } from 'react';

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  login: (id: any, token: any) => {},
  logout: () => {},
  token: null
});
