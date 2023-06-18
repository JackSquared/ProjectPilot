import React, {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
} from 'react';

export const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: (() => {}) as Dispatch<SetStateAction<boolean>>,
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
