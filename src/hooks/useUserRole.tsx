import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type AppRole = 'masteradministrator' | 'administrator' | 'objektleiter' | 'reinigungsmitarbeiter';

interface UserRole {
  id: string;
  role: AppRole;
  company_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useUserRole = () => {
  const { user } = useAuth();

  const {
    data: userRoles,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['userRoles', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        return [];
      }

      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching user roles:', error);
        throw error;
      }

      return data as UserRole[];
    },
    enabled: !!user?.id,
  });

  // Helper functions
  const hasRole = (role: AppRole): boolean => {
    return userRoles?.some((r) => r.role === role) ?? false;
  };

  const isAdmin = (): boolean => {
    return hasRole('masteradministrator') || hasRole('administrator');
  };

  const isMasterAdmin = (): boolean => {
    return hasRole('masteradministrator');
  };

  const canManageContacts = (): boolean => {
    return isAdmin();
  };

  const canManageEmployees = (): boolean => {
    return isAdmin() || hasRole('objektleiter');
  };

  const canViewReports = (): boolean => {
    return isAdmin();
  };

  const getPrimaryRole = (): AppRole | null => {
    if (!userRoles || userRoles.length === 0) return null;

    // Priority order: masteradministrator > administrator > objektleiter > reinigungsmitarbeiter
    if (hasRole('masteradministrator')) return 'masteradministrator';
    if (hasRole('administrator')) return 'administrator';
    if (hasRole('objektleiter')) return 'objektleiter';
    if (hasRole('reinigungsmitarbeiter')) return 'reinigungsmitarbeiter';

    return userRoles[0].role;
  };

  const getCompanyId = (): string | null => {
    return userRoles?.[0]?.company_id ?? null;
  };

  return {
    userRoles: userRoles ?? [],
    isLoading,
    error,
    hasRole,
    isAdmin,
    isMasterAdmin,
    canManageContacts,
    canManageEmployees,
    canViewReports,
    getPrimaryRole,
    getCompanyId,
  };
};
