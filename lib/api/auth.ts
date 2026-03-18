import apiClient, { ApiResponse } from './client';
import { auth } from '@/lib/config/env';

/**
 * Login request payload
 */
export interface LoginRequest {
  identifier: string; // email or phone
  password: string;
}

/**
 * Login response data
 */
export interface LoginResponseData {
  access_token: string;
  token_type: 'bearer';
  expires_in: number;
}

/**
 * User profile response
 */
export interface UserProfile {
  id: string;
  email: string;
  phone?: string;
  name?: string;
  role?: string;
}

/**
 * Authentication API endpoints
 */
export const authApi = {
  /**
   * Login with email/phone and password
   * POST /auth/login
   */
  login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponseData>> => {
    const response = await apiClient.post<ApiResponse<LoginResponseData>>(
      '/auth/login',
      credentials,
      { baseURL: auth }
    );
    return response.data;
  },

  /**
   * Get current user profile
   * GET /auth/me
   */
  getCurrentUser: async (): Promise<ApiResponse<UserProfile>> => {
    const response = await apiClient.get<ApiResponse<UserProfile>>('/auth/me', {
      baseURL: auth
    });
    return response.data;
  },
};
