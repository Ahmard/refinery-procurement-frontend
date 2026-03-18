import { useQuery } from '@tanstack/react-query';
import type { CatalogFilters } from '@/lib/types';
import type { CatalogSearchParams } from '@/lib/api/catalog';
import { catalogApi } from '@/lib/api/catalog';

/**
 * Catalog Query Keys
 * 
 * Centralized query key factory for catalog-related queries
 */
export const queryKeys = {
  catalog: {
    /** Base key for all catalog queries */
    all: ['catalog'] as const,
    
    /** Key for catalog lists (with filters) */
    lists: () => [...queryKeys.catalog.all, 'lists'] as const,
    
    /** Key for a specific list with filters */
    list: (filters: CatalogFilters) => [...queryKeys.catalog.lists(), filters] as const,
    
    /** Key for catalog item details */
    details: () => [...queryKeys.catalog.all, 'details'] as const,
    
    /** Key for a specific catalog item */
    detail: (id: string) => [...queryKeys.catalog.details(), id] as const,
    
    /** Key for compatible items */
    compatible: (id: string) => [...queryKeys.catalog.detail(id), 'compatible'] as const,
  },
};

/**
 * Use Catalog Search Hook
 * 
 * Implements catalog search with TanStack Query featuring:
 * - Automatic caching and refetching
 * - Stale time configuration (5 minutes)
 * - Error handling with retry logic
 * - Loading state management
 * - Refetch capability
 * 
 * @param filters - Catalog search filters
 * @returns Query result with items, loading, error, and refetch
 */
export function useCatalogSearch(filters: CatalogFilters = {}) {
  return useQuery({
    queryKey: queryKeys.catalog.list(filters),
    queryFn: async () => {
      // Build query params from filters
      const params: CatalogSearchParams = {};
      
      if (filters.search) params.q = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.supplier_id) params.supplier_id = filters.supplier_id;
      if (filters.in_stock !== undefined) params.in_stock = filters.in_stock;
      if (filters.sort_by) params.sort = `${filters.sort_by}_${filters.sort_order || 'asc'}`;
      if (filters.page !== undefined) params.page = filters.page;
      if (filters.page_size !== undefined) params.page_size = filters.page_size;
      
      // Call catalog API
      const response = await catalogApi.search(params);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch catalog items');
      }
      
      // Transform API response to match our expected format
      return {
        items: response.data.records,
        total: response.data.total_records,
        page: filters.page || 1,
        page_size: filters.page_size || 10,
        total_pages: response.data.total_pages,
      };
    },
    // Stale time: 5 minutes
    staleTime: 5 * 60 * 1000,
    
    // Retry logic
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors
      if (error.message.includes('40')) {
        return false;
      }
      // Retry up to 3 times
      return failureCount < 3;
    },
    
    // Retry delay: exponential backoff
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    
    // Keep data in cache for 30 minutes
    gcTime: 30 * 60 * 1000,
    
    // Refetch on window focus (optional, can be disabled)
    refetchOnWindowFocus: false,
    
    // Initial data (optional, can be set for SSR hydration)
    initialData: undefined,
  });
}

export default useCatalogSearch;
