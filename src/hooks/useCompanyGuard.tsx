import { useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCompanyData } from '@/hooks/useCompanyData';
import { useToast } from '@/hooks/use-toast';

export function useCompanyGuard() {
  const { user, loading: authLoading } = useAuth();
  const { hasCompany, loading: companyLoading } = useCompanyData();
  const location = useLocation();
  const { toast } = useToast();

  // Allowed routes when no company exists
  const allowedRoutes = ['/einstellungen', '/profileinstellungen', '/company-setup', '/login', '/register'];

  const blockAction = (actionName: string = "diese Funktion") => {
    toast({
      title: "Firmendaten erforderlich",
      description: `Sie müssen zuerst Ihre Firmendaten vervollständigen, bevor Sie ${actionName} nutzen können.`,
      variant: "destructive",
    });
  };

  const loading = authLoading || companyLoading;

  return {
    hasCompany,
    loading,
    needsCompanySetup: user && !loading && hasCompany === false,
    isBlocked: user && !loading && hasCompany === false && !allowedRoutes.includes(location.pathname),
    blockAction
  };
}