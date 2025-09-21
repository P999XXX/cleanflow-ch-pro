import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useCompanyGuard() {
  const { user, loading: authLoading } = useAuth();
  const [hasCompany, setHasCompany] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Allowed routes when no company exists
  const allowedRoutes = ['/einstellungen', '/profileinstellungen', '/login', '/register'];

  useEffect(() => {
    const checkCompanyData = async () => {
      if (!user || authLoading) {
        setLoading(authLoading);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('companies')
          .select('id, name')
          .eq('owner_id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking company data:', error);
        }

        const companyExists = !!data?.id && !!data?.name;
        setHasCompany(companyExists);

        // If no company and not on allowed route, redirect to settings
        if (!companyExists && !allowedRoutes.includes(location.pathname) && !authLoading) {
          navigate('/einstellungen');
          toast({
            title: "Firmendaten erforderlich",
            description: "Bitte vervollständigen Sie zuerst Ihre Firmendaten.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error checking company data:', error);
        setHasCompany(false);
      } finally {
        setLoading(false);
      }
    };

    checkCompanyData();
  }, [user, authLoading, location.pathname, navigate, toast]);

  const blockAction = (actionName: string = "diese Funktion") => {
    toast({
      title: "Firmendaten erforderlich",
      description: `Sie müssen zuerst Ihre Firmendaten vervollständigen, bevor Sie ${actionName} nutzen können.`,
      variant: "destructive",
    });
    navigate('/einstellungen');
  };

  return {
    hasCompany,
    loading: loading || authLoading,
    needsCompanySetup: user && !loading && hasCompany === false,
    isBlocked: user && !loading && hasCompany === false && !allowedRoutes.includes(location.pathname),
    blockAction
  };
}