import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../api';

export type Role = 'GUEST' | 'USER' | 'ADMIN';
export type User = { id: string; email: string; firstName: string; lastName: string; role: Role; phoneNumber?: string } | null;

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
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('auth_token');
      const storedUserId = localStorage.getItem('user_id');
      if (storedToken && storedUserId) {
        setToken(storedToken);
        try {
          const userData = await AuthService.getProfile(storedUserId);
          setUser(userData);
        } catch (error) {
          console.error("Failed to restore session", error);
          logout();
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    initializeAuth();
  }, []);

  useEffect(() => {
    // client.ts already retrieves it dynamically using localStorage.getItem('auth_token')
  }, [token]);

  const login = async (newToken: string, userId: string) => {
    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('user_id', userId);
    setToken(newToken);
    try {
      const userData = await AuthService.getProfile(userId);
      // Decode JWT role to ensure token validity before setting user (Optional but good)
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Failed to load profile", error);
      return null;
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
    } catch (e) {
      console.error("Error logging out from server", e);
    }
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
