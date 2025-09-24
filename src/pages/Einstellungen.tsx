import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Building, AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import CompanyForm from "@/components/CompanyForm";

interface EinstellungenProps {
  isSetupMode?: boolean;
}

const Einstellungen = ({ isSetupMode = false }: EinstellungenProps) => {
  const { user, signOut } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hasCompany, setHasCompany] = useState<boolean | null>(null);
  const [companyLoading, setCompanyLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    setIsDeleting(true);
    
    try {
      // Soft delete the user account by updating the profile status
      const { error } = await supabase
        .from('profiles')
        .update({ 
          account_status: 'deleted',
          deleted_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Account gelöscht",
        description: "Ihr Account wurde erfolgreich gelöscht. Sie werden automatisch abgemeldet.",
      });

      // Delete auth user via backend function and sign out
      await supabase.functions.invoke('delete-account');
      await signOut();
      navigate("/login");

    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Account konnte nicht gelöscht werden. Bitte versuchen Sie es erneut.",
      });
    } finally {
      setIsDeleting(false);
    }
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

        {/* Account Deletion Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Konto löschen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-muted-foreground mb-4">
                Wenn Sie Ihr Konto löschen, werden alle Ihre Daten unwiderruflich entfernt und 
                Sie können sich nicht mehr anmelden. Diese Aktion kann nicht rückgängig gemacht werden.
              </p>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    className="gap-2"
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                    Account dauerhaft löschen
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      Account wirklich löschen?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Diese Aktion löscht Ihr Konto und alle damit verbundenen Daten unwiderruflich. 
                      Sie verlieren den Zugang zu allen Ihren Projekten, Kunden und Mitarbeiterdaten.
                      <br /><br />
                      <strong>Diese Aktion kann nicht rückgängig gemacht werden.</strong>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex flex-col items-center gap-3 pt-4">
                    <AlertDialogAction 
                      onClick={handleDeleteAccount}
                      className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Wird gelöscht..." : "Account dauerhaft löschen"}
                    </AlertDialogAction>
                    <AlertDialogCancel className="text-muted-foreground hover:text-foreground transition-colors text-sm bg-transparent border-0 shadow-none p-0 h-auto">
                      Abbrechen
                    </AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {modalOpen && (
        <CompanyForm 
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