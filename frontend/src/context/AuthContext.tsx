// T010: AuthContext with login/logout methods and localStorage token management

'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { AuthState, LoginCredentials, SignupCredentials, User } from '@/types';
import { api } from '@/lib/api';

interface AuthContextType {
  state: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: true,
  });

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const userJson = localStorage.getItem(AUTH_USER_KEY);

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson) as User;
        setState({
          isAuthenticated: true,
          user,
          token,
          isLoading: false,
        });
      } catch {
        // Invalid user data, clear storage
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);
        setState({
          isAuthenticated: false,
          user: null,
          token: null,
          isLoading: false,
        });
      }
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const session = await api.login(credentials);

      // Store token and user in localStorage
      localStorage.setItem(AUTH_TOKEN_KEY, session.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(session.user));
      localStorage.setItem('is_demo_user', 'false'); // Mark as real user

      setState({
        isAuthenticated: true,
        user: session.user,
        token: session.token,
        isLoading: false,
      });
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const signup = useCallback(async (credentials: SignupCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const session = await api.signup(credentials);

      // Store token and user in localStorage
      localStorage.setItem(AUTH_TOKEN_KEY, session.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(session.user));
      localStorage.setItem('is_demo_user', 'false'); // Mark as real user

      setState({
        isAuthenticated: true,
        user: session.user,
        token: session.token,
        isLoading: false,
      });
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    // Clear localStorage
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem('is_demo_user');

    setState({
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,
    });
  }, []);

  return (
    <AuthContext.Provider value={{ state, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
