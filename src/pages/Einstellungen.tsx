import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import CompanyForm from "@/components/CompanyForm";

interface EinstellungenProps {
  isSetupMode?: boolean;
}

const Einstellungen = ({ isSetupMode = false }: EinstellungenProps) => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [hasCompany, setHasCompany] = useState<boolean | null>(null);
  const [companyLoading, setCompanyLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Check if we should auto-open the form (from email verification)
  const autoOpen = searchParams.get('setup') === 'true' || isSetupMode;

  useEffect(() => {
    const checkCompanyData = async () => {
      if (!user) {
        setCompanyLoading(false);
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

        // Auto-open form if no company and should auto-open
        if (!companyExists && autoOpen) {
          setModalOpen(true);
          // Clear setup parameter from URL
          if (searchParams.get('setup')) {
            setSearchParams({});
          }
        }
      } catch (error) {
        console.error('Error checking company data:', error);
        setHasCompany(false);
      } finally {
        setCompanyLoading(false);
      }
    };

    checkCompanyData();
  }, [user, autoOpen, searchParams, setSearchParams]);

  const handleCompanySuccess = () => {
    setHasCompany(true);
    setModalOpen(false);
  };

  if (companyLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Einstellungen</h1>
      </div>
      
      <div className="grid gap-6">
        {/* Firmendaten Karte */}
        {!hasCompany ? (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Building className="h-5 w-5" />
                Firmendaten erforderlich
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-4">
              <p className="text-muted-foreground">
                Bitte vervollständigen Sie Ihre Firmendaten, um CleanFlow.ai nutzen zu können.
              </p>
              <Button 
                className="bg-primary hover:bg-primary/90" 
                onClick={() => setModalOpen(true)}
              >
                Erfassen
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Firmendaten
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-4">
              <p className="text-muted-foreground">
                Bearbeiten Sie Ihre Firmendaten und Kontaktinformationen.
              </p>
              <Button 
                variant="outline" 
                onClick={() => setModalOpen(true)}
              >
                Anpassen
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Allgemeine Einstellungen</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Hier können Sie die allgemeinen Einstellungen der Anwendung verwalten.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Benachrichtigungen</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Verwalten Sie Ihre Benachrichtigungseinstellungen.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Sicherheit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Sicherheitseinstellungen und Passwort ändern.
            </p>
          </CardContent>
        </Card>
      </div>
      
      {modalOpen && (
        <CompanyForm 
          isProfile={true} 
          isSetupMode={isSetupMode} 
          onSuccess={handleCompanySuccess}
          isModal={true}
          onClose={() => setModalOpen(false)}
          title={hasCompany ? "Firmendaten bearbeiten" : "Firmendaten erfassen"}
        />
      )}
    </div>
  );
};

export default Einstellungen;