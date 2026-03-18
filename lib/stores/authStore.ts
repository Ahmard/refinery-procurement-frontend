import { create } from 'zustand';
import { authApi, LoginRequest, UserProfile } from '@/lib/api/auth';

/**
 * Authentication Store State
 */
interface AuthState {
  // State
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<UserProfile>) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

/**
 * Initial state
 */
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

/**
 * Authentication Zustand Store
 * 
 * Features:
 * - Login/logout functionality
 * - Token management
 * - User profile caching
 */
export const useAuthStore = create<AuthState>()((set, get) => ({
  // Initial state
  ...initialState,

  /**
   * Login with credentials
   * Stores token in both state and localStorage
   */
  login: async (credentials: LoginRequest) => {
    set({ isLoading: true, error: null });

    try {
      // Call login API
      const response = await authApi.login(credentials);
      
      if (response.success && response.data) {
        const { access_token } = response.data;
        
        // Store token in localStorage for API client
        localStorage.setItem('auth_token', access_token);
        
        // Also set cookie for middleware (expires in 7 days)
        document.cookie = `auth_token=${access_token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`;
        
        // Update store state
        set({
          token: access_token,
          isAuthenticated: true,
          isLoading: false,
        });

        // Fetch user profile
        try {
          const profileResponse = await authApi.getCurrentUser();
          if (profileResponse.success && profileResponse.data) {
            set({ user: profileResponse.data });
          }
        } catch (profileError) {
          console.warn('[Auth Store] Failed to fetch user profile:', profileError);
          // Continue anyway - we have a valid token
        }

        console.log('[Auth Store] Login successful');
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('[Auth Store] Login error:', error);
      set({
        error: error.response?.data?.message || error.message || 'Login failed',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Logout - clear all auth state
   */
  logout: () => {
    // Clear token from localStorage
    localStorage.removeItem('auth_token');
    
    // Clear cookie
    document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Strict';
    
    // Reset store state
    set(initialState);
    
    console.log('[Auth Store] Logout successful');
  },

  /**
   * Update user profile
   */
  updateUser: (user: Partial<UserProfile>) => {
    const currentUser = get().user;
    if (currentUser) {
      set({ user: { ...currentUser, ...user } });
    }
  },

  /**
   * Clear error state
   */
  clearError: () => {
    set({ error: null });
  },

  /**
   * Set loading state
   */
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));
