/**
 * Centralized React Query configuration
 * Optimizes caching, stale times, and retry strategies
 */

export const queryConfig = {
  // Contact queries
  contacts: {
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
  },
  
  // Company queries
  companies: {
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
  },
  
  // Employee details (more frequently updated)
  employeeDetails: {
    staleTime: 1000 * 60 * 2, // 2 minutes
    cacheTime: 1000 * 60 * 5, // 5 minutes
  },
  
  // User roles (rarely changes)
  userRoles: {
    staleTime: 1000 * 60 * 15, // 15 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
  },
  
  // Audit logs (admin only, can be longer)
  auditLogs: {
    staleTime: 1000 * 60 * 10, // 10 minutes
    cacheTime: 1000 * 60 * 20, // 20 minutes
  },
  
  // Default retry strategy
  retry: {
    retries: 3,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
  },
};

/**
 * Query keys factory for consistent naming
 */
export const queryKeys = {
  // Contacts
  allContacts: ['allContacts'] as const,
  contactPersons: ['contactPersons'] as const,
  contactPerson: (id: string) => ['contactPersons', id] as const,
  
  // Companies
  companies: ['companies'] as const,
  company: (id: string) => ['companies', id] as const,
  
  // Employee
  employeeDetails: (contactPersonId?: string) => 
    contactPersonId 
      ? ['employeeDetails', contactPersonId] as const
      : ['employeeDetails'] as const,
  employeeChildren: (employeeDetailsId?: string) =>
    employeeDetailsId
      ? ['employeeChildren', employeeDetailsId] as const
      : ['employeeChildren'] as const,
  
  // User & Auth
  userRoles: (userId?: string) => 
    userId 
      ? ['userRoles', userId] as const
      : ['userRoles'] as const,
  profile: (userId?: string) =>
    userId
      ? ['profile', userId] as const
      : ['profile'] as const,
  
  // Audit
  auditLogs: (companyId: string, tableFilter?: string, limit?: number) =>
    ['auditLogs', companyId, tableFilter, limit] as const,
} as const;
