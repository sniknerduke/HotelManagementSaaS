import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../api';

export type Role = 'GUEST' | 'STAFF' | 'ADMIN';
export type User = { id: string; email: string; firstName: string; lastName: string; role: Role } | null;

interface AuthContextType {
  user: User;
  token: string | null;
  login: (token: string, userId: string) => Promise<any>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: async () => {},
  logout: () => {},
  isLoading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('auth_token');
      const storedUserId = localStorage.getItem('user_id');
      if (storedToken && storedUserId) {
        try {
          const userData = await AuthService.getProfile(storedUserId);
          setUser(userData);
        } catch (error) {
          console.error("Failed to restore session", error);
          logout();
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (newToken: string, userId: string) => {
    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('user_id', userId);
    setToken(newToken);
    try {
      const userData = await AuthService.getProfile(userId);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Failed to load profile", error);
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
