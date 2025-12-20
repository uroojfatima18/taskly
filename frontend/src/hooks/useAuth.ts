// T011: useAuth custom hook wrapping AuthContext

'use client';

import { useAuthContext } from '@/context/AuthContext';

export function useAuth() {
  const { state, login, signup, logout } = useAuthContext();

  return {
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    token: state.token,
    isLoading: state.isLoading,
    login,
    signup,
    logout,
  };
}
