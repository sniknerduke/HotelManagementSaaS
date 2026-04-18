import React, { createContext, useContext, useState } from 'react';

type Role = 'GUEST' | 'ADMIN';
type User = { role: Role; name: string } | null;

interface AuthContextType {
  user: User;
  login: (role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);

  const login = (role: Role) => {
    setUser({ role, name: role === 'ADMIN' ? 'Admin User' : 'John Doe' });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
