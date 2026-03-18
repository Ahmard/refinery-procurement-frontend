import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// API Base URL from environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/**
 * Create Axios instance with default configuration
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

/**
 * Request Interceptor - Add JWT token to authenticated requests
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('[API Client] Adding auth token to request:', config.url);
      } else {
        console.warn('[API Client] No auth token found for request:', config.url);
      }
    }
    
    // Log request details for debugging
    console.log('[API Client] Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      headers: config.headers,
      data: config.data,
    });
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor - Handle errors globally
 * - 401: Session expired - preserve state and redirect to login
 * - 409: Conflict (supplier mismatch) - show user-friendly error
 * - Network errors: Retry with exponential backoff
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('[API Client] Response success:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Don't handle 401 on login endpoint itself
    if (error.response?.status === 401 && !originalRequest.url?.includes('/auth/login')) {
      // Preserve draft PO state before redirecting (will be implemented in Task #4)
      if (typeof window !== 'undefined') {
        try {
          // Try to backup draft PO if store exists
          const draftBackup = localStorage.getItem('draft_po_state');
          if (draftBackup) {
            localStorage.setItem('draft_po_backup', draftBackup);
            console.log('[API Client] Draft PO backed up for recovery');
          }
        } catch (e) {
          // Store not available yet - that's ok
          console.warn('[API Client] Draft store not available, skipping backup');
        }

        // Clear auth token
        localStorage.removeItem('auth_token');

        // Redirect to login with returnTo URL
        const currentPath = window.location.pathname;
        const loginUrl = `/login?returnTo=${encodeURIComponent(currentPath)}`;
        window.location.href = loginUrl;
      }

      console.error('[API Client] Session expired. Redirecting to login...');
    }

    // Handle 409 Conflict (supplier mismatch)
    if (error.response?.status === 409) {
      const errorMessage = (error.response.data as any)?.message || 
                          'Cannot add items from multiple suppliers. This PO is locked to a single supplier.';
      console.error('[API Client] Supplier constraint violation:', errorMessage);
      console.error('[API Client] Error response:', error.response.data);
      
      // Show user-friendly error (toast will be implemented later)
      if (typeof window !== 'undefined') {
        alert(errorMessage);
      }
    }
    
    // Log all errors for debugging
    console.error('[API Client] Request failed:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    // Handle network errors - retry with exponential backoff
    if (!error.response && !originalRequest._retry) {
      const maxRetries = 3;
      originalRequest._retry = true;
      
      for (let i = 0; i < maxRetries; i++) {
        try {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
          return apiClient(originalRequest);
        } catch (retryError) {
          if (i === maxRetries - 1) {
            console.error('[API Client] Network error after retries:', retryError);
            throw retryError;
          }
        }
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Generic API response wrapper type matching our API structure
 */
export interface ApiResponse<T = any> {
  code: string;      // "000" for success
  success: boolean;
  timestamp: number;
  message: string;
  data: T;
}

export default apiClient;
