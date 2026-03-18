/**
 * Environment Configuration
 * 
 * Central configuration for all service URLs and environment variables
 */

/**
 * Service URLs from environment variables
 * Falls back to localhost for development if not set
 */
export const config = {
  services: {
    admin: process.env.NEXT_PUBLIC_ADMIN_SERVICE_URL || 'http://localhost:9152/api/v1/admin',
    auth: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:9151/api/v1/auth',
    catalog: process.env.NEXT_PUBLIC_CATALOG_SERVICE_URL || 'http://localhost:9153/api/v1/catalog',
    procurement: process.env.NEXT_PUBLIC_PROCUREMENT_SERVICE_URL || 'http://localhost:9154/api/v1/procurement',
  },
  
  /**
   * App configuration
   */
  app: {
    name: 'Refinery Procurement',
    version: '0.1.0',
  },
} as const;

/**
 * Type for config object
 */
export type Config = typeof config;

/**
 * Get service URL by name
 */
export function getServiceUrl(serviceName: keyof typeof config.services): string {
  return config.services[serviceName];
}

// Export individual service URLs for convenience
export const {
  admin,
  auth,
  catalog,
  procurement,
} = config.services;
