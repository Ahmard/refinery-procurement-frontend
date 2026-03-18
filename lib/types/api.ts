/**
 * API Response Types & Error Handling
 */

import type { PaginationMeta } from './common';

/**
 * Generic API Response Codes
 */
export enum ApiResponseCode {
  SUCCESS = '000',
  ERROR = '999',
  UNAUTHORIZED = '401',
  FORBIDDEN = '403',
  NOT_FOUND = '404',
  CONFLICT = '409',
  SERVER_ERROR = '500',
}

/**
 * Generic API Response Wrapper
 */
export interface ApiResponse<T = any> {
  code: ApiResponseCode | string;
  message: string;
  data?: T;
}

/**
 * Paginated API Response
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: PaginationMeta;
}

/**
 * API Error Response
 */
export interface ApiErrorResponse {
  code: string;
  message: string;
  details?: any;
  errors?: Record<string, string[]>;
}

/**
 * Authentication Response (Login)
 */
export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

/**
 * Query Parameters for API requests
 */
export interface QueryParams {
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  search?: string;
  [key: string]: any; // Allow additional query params
}

/**
 * Success response type helper
 */
export type SuccessResponse<T> = Omit<ApiResponse<T>, 'code'> & {
  code: ApiResponseCode.SUCCESS | '000';
};

/**
 * Error response type helper
 */
export type ErrorResponse = Omit<ApiErrorResponse, 'code'> & {
  code: Exclude<string, ApiResponseCode.SUCCESS | '000'>;
};
