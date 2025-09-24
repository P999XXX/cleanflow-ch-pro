import { useCompanyGuard } from '@/hooks/useCompanyGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';

interface CompanyProtectionWrapperProps {
  children: React.ReactNode;
}

export function CompanyProtectionWrapper({ children }: CompanyProtectionWrapperProps) {
  const { hasCompany, loading, needsCompanySetup } = useCompanyGuard();
  const location = useLocation();
  const navigate = useNavigate();

  // Allow these routes even without company
  const allowedRoutes = ['/einstellungen', '/profileinstellungen', '/company-setup'];
  const isAllowedRoute = allowedRoutes.includes(location.pathname);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (needsCompanySetup && !isAllowedRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <Card className="w-full max-w-md border-primary/20 bg-primary/5">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-primary text-2xl">
              <Building className="h-6 w-6" />
              Firmendaten erforderlich
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-amber-600 mb-4">
              <AlertTriangle className="h-5 w-5" />
              <p className="font-medium">Vervollständigen Sie Ihr Profil</p>
            </div>
            <p className="text-muted-foreground">
              Bevor Sie CleanFlow.ai nutzen können, müssen Sie Ihre Firmendaten vervollständigen.
              Dies ist nur einmalig erforderlich.
            </p>
            <Button 
              className="bg-primary hover:bg-primary/90" 
              onClick={() => navigate('/company-setup')}
            >
              Firmendaten jetzt erfassen
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}