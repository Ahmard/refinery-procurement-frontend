'use client';

import { useCallback } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';
import type { LoginRequest } from '@/lib/api/auth';

/**
 * Custom hook for authentication
 * Provides a convenient interface for components to access auth state and actions
 */
export function useAuth() {
  // Get state from store
  const { 
    user, 
    token, 
    isAuthenticated, 
    isLoading, 
    error 
  } = useAuthStore();

  // Get actions from store
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const updateUser = useAuthStore((state) => state.updateUser);
  const clearError = useAuthStore((state) => state.clearError);
  const setLoading = useAuthStore((state) => state.setLoading);

  /**
   * Wrapped login action with error handling
   */
  const handleLogin = useCallback(async (credentials: LoginRequest) => {
    try {
      await login(credentials);
      return { success: true };
    } catch (error: any) {
      console.error('[useAuth] Login failed:', error);
      return { 
        success: false, 
        error: error.message || 'Login failed' 
      };
    }
  }, [login]);

  /**
   * Wrapped logout action
   */
  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    login: handleLogin,
    logout: handleLogout,
    updateUser,
    clearError,
    setLoading,
  };
}
