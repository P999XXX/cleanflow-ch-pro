import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export function useCompanyGuard() {
  const { user, loading: authLoading } = useAuth();
  const [hasCompany, setHasCompany] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkCompanyData = async () => {
      if (!user || authLoading) {
        setLoading(authLoading);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('companies')
          .select('id')
          .eq('owner_id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking company data:', error);
        }

        setHasCompany(!!data);
      } catch (error) {
        console.error('Error checking company data:', error);
        setHasCompany(false);
      } finally {
        setLoading(false);
      }
    };

    checkCompanyData();
  }, [user, authLoading]);

  return {
    hasCompany,
    loading: loading || authLoading,
    needsCompanySetup: user && !loading && hasCompany === false
  };
}