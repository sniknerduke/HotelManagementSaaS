import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { AuthService } from '../api';

export type Role = 'GUEST' | 'STAFF' | 'ADMIN';
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

  // Guard: when login() has been called, skip initializeAuth to prevent double-set of user
  const loginCalledRef = useRef(false);

  useEffect(() => {
    const initializeAuth = async () => {
      // If login() was already called in this session, skip re-initialization
      if (loginCalledRef.current) {
        setIsLoading(false);
        return;
      }

      const storedToken = localStorage.getItem('auth_token');
      const storedUserId = localStorage.getItem('user_id');
      if (storedToken && storedUserId) {
        setToken(storedToken);
        try {
          const userData = await AuthService.getProfile(storedUserId);
          // Only set user if login() hasn't been called while we were fetching
          if (!loginCalledRef.current) {
            setUser(userData);
          }
        } catch (error) {
          console.error("Failed to restore session", error);
          if (!loginCalledRef.current) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_id');
            setToken(null);
            setUser(null);
          }
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    initializeAuth();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(async (newToken: string, userId: string) => {
    loginCalledRef.current = true;
    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('user_id', userId);
    setToken(newToken);
    try {
      const userData = await AuthService.getProfile(userId);
      setUser(userData);
      setIsLoading(false);
      return userData;
    } catch (error) {
      console.error("Failed to load profile", error);
      setIsLoading(false);
      return null;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await AuthService.logout();
    } catch (e) {
      console.error("Error logging out from server", e);
    }
    loginCalledRef.current = false;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
    setToken(null);
    setUser(null);
    window.location.href = '/';
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

