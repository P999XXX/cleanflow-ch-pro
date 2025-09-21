import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export function useCompanyGuard() {
  const { user } = useAuth();
  const [hasCompany, setHasCompany] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkCompanyData = async () => {
      if (!user) {
        setHasCompany(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('companies')
          .select('id')
          .eq('owner_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error checking company:', error);
          setHasCompany(false);
        } else {
          setHasCompany(!!data);
        }
      } catch (error) {
        console.error('Error checking company:', error);
        setHasCompany(false);
      } finally {
        setLoading(false);
      }
    };

    checkCompanyData();
  }, [user]);

  return { hasCompany, loading };
}