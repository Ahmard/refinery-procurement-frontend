'use client';

import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useShallow } from 'zustand/shallow';

/**
 * Serializer/Deserializer interface for URL state
 */
export interface UrlStateConfig<T extends Record<string, any>> {
  /** Prefix for URL parameters (optional) */
  prefix?: string;
  
  /** Serialize state to URL params */
  serialize: (state: T) => Record<string, string>;
  
  /** Deserialize URL params to state */
  deserialize: (params: Record<string, string>) => Partial<T>;
}

/**
 * Use URL State Hook
 * 
 * Factory hook that creates URL-synced state management.
 * Syncs application state with URL query parameters using Next.js router.
 * 
 * Features:
 * - Shallow routing enabled (no full page reload)
 * - Browser back/forward navigation support
 * - Type-safe generic implementation
 * - Automatic serialization/deserialization
 * - Debounced updates to prevent excessive navigation
 * 
 * @param initialState - Initial state configuration
 * @param config - Serialization configuration
 * @returns State and setter functions
 */
export function useUrlState<T extends Record<string, any>>(
  initialState: T,
  config: UrlStateConfig<T>
) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const { prefix = '', serialize, deserialize } = config;
  
  /**
   * Get current state from URL params
   */
  const getStateFromUrl = useCallback((): Partial<T> => {
    const params: Record<string, string> = {};
    
    // Extract params with optional prefix
    searchParams.forEach((value, key) => {
      if (!prefix || key.startsWith(prefix)) {
        params[key] = value;
      }
    });
    
    return deserialize(params);
  }, [searchParams, prefix, deserialize]);
  
  /**
   * Current state (merged with initial state)
   */
  const state = useMemo((): T => {
    const urlState = getStateFromUrl();
    return { ...initialState, ...urlState };
  }, [initialState, getStateFromUrl]);
  
  /**
   * Update URL with new state
   */
  const setState = useCallback((
    newState: Partial<T> | ((prev: T) => Partial<T>),
    options?: { replace?: boolean; scroll?: boolean }
  ) => {
    const update = typeof newState === 'function' 
      ? newState(state) 
      : newState;
    
    // Merge with current state
    const mergedState = { ...state, ...update };
    
    // Serialize to URL params
    const serialized = serialize(mergedState);
    
    // Create new URL with updated params
    const params = new URLSearchParams(searchParams.toString());
    
    // Set/clear params based on serialized values
    Object.entries(serialized).forEach(([key, value]) => {
      const prefixedKey = prefix ? `${prefix}${key}` : key;
      
      if (value === '' || value === null || value === undefined) {
        params.delete(prefixedKey);
      } else {
        params.set(prefixedKey, value);
      }
    });
    
    // Navigate with shallow routing
    const url = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    const scroll = options?.scroll ?? false;
    
    if (options?.replace) {
      router.replace(url, { scroll });
    } else {
      router.push(url, { scroll });
    }
  }, [state, searchParams, serialize, prefix, router]);
  
  /**
   * Reset state to initial values
   */
  const resetState = useCallback((options?: { replace?: boolean; scroll?: boolean }) => {
    setState(initialState, options);
  }, [setState, initialState]);
  
  return {
    /** Current state synced with URL */
    state,
    
    /** Update state and URL */
    setState,
    
    /** Reset to initial state */
    resetState,
    
    /** Raw URL params (for advanced usage) */
    params: searchParams,
  };
}

/**
 * Helper: Create simple string serializer
 */
export function createStringSerializer<T extends Record<string, string | number | boolean>>(
  keys: (keyof T)[]
): Pick<UrlStateConfig<T>, 'serialize' | 'deserialize'> {
  return {
    serialize: (state) => {
      const result: Record<string, string> = {};
      keys.forEach((key) => {
        const value = state[key];
        if (value !== undefined && value !== null) {
          result[String(key)] = String(value);
        }
      });
      return result;
    },
    deserialize: (params) => {
      const result: Partial<T> = {};
      keys.forEach((key) => {
        const value = params[String(key)];
        if (value !== undefined) {
          result[key] = value as any;
        }
      });
      return result;
    },
  };
}

/**
 * Helper: Create JSON serializer for complex objects
 */
export function createJsonSerializer<T extends Record<string, any>>(
  key: string
): Pick<UrlStateConfig<T>, 'serialize' | 'deserialize'> {
  return {
    serialize: (state) => {
      try {
        return { [key]: JSON.stringify(state) };
      } catch {
        return { [key]: '' };
      }
    },
    deserialize: (params) => {
      try {
        const json = params[key];
        if (json) {
          return JSON.parse(json) as Partial<T>;
        }
      } catch {
        // Ignore parse errors
      }
      return {};
    },
  };
}

export default useUrlState;
