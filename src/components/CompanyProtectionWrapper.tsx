import { useCompanyGuard } from '@/hooks/useCompanyGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CompanyForm from '@/components/CompanyForm';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

interface CompanyProtectionWrapperProps {
  children: React.ReactNode;
}

export function CompanyProtectionWrapper({ children }: CompanyProtectionWrapperProps) {
  const { hasCompany, loading, needsCompanySetup } = useCompanyGuard();
  const [showForm, setShowForm] = useState(false);
  const location = useLocation();

  // Allow these routes even without company
  const allowedRoutes = ['/einstellungen', '/profileinstellungen'];
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
        <div className="w-full max-w-2xl">
          <Card className="border-primary/20 bg-primary/5">
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
                onClick={() => setShowForm(true)}
              >
                Firmendaten jetzt erfassen
              </Button>
            </CardContent>
          </Card>
          
          {showForm && (
            <CompanyForm 
              isSetupMode={true}
              isModal={true}
              onClose={() => setShowForm(false)}
              onSuccess={() => {
                setShowForm(false);
                window.location.reload(); // Reload to update company status
              }}
              title="Firmendaten erfassen"
            />
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}